import { getCurrentUser, refreshUser, sendVerificationEmail } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { InfoIcon, AlertCircle } from "lucide-react";
import { AsyncButton } from "./custom/utility/async-button";
import { observer } from "mobx-react-lite";
import { userStore } from "@/lib/contexts";
import { reaction } from "mobx";
import { useTranslation } from "react-i18next";

export const NotificationBanner = observer(() => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Notification[]>([]);
  const [hasSentVerificationEmail, setHasSentVerificationEmail] = useState<boolean>(false);

  async function getMessages() {
    const messages: Notification[] = [];

    if (userStore.user){
        const firebaseUser = await getCurrentUser();

        if (!firebaseUser?.emailVerified && firebaseUser?.email) {
            messages.push({
                type: NotificationType.WARNING,
                title: t("auth:emailVerification.title"),
                message: t("auth:emailVerification.message"),
                actionButton: {
                    label: hasSentVerificationEmail ? t("auth:emailVerification.reload") : t("auth:emailVerification.sendEmail"),
                    onClick: async () => {
                      if (hasSentVerificationEmail) {
                        setHasSentVerificationEmail(false);
                        await refreshUser();
                        userStore.setUser(null);
                      }
                      else {
                        const task = sendVerificationEmail();
                        toast.promise(task, {
                          loading: t("toasts:emailVerification.sending"),
                          success: () =>{
                            setHasSentVerificationEmail(true);
                            return t("toasts:emailVerification.sent");
                          },
                          error: t("toasts:emailVerification.failed")
                        });

                        await task;
                      }
                    }
                }
            });
        }
    }

    setMessages(messages);
  }

  useEffect(() => {
    const dispose = reaction(
      () => userStore.user,
      () => getMessages()
    );

    return () => dispose();
  }, []);

  return (
    <div className="flex flex-col gap-2 max-w-128">
      {messages.map((message, index) => (
        <Alert key={index}>
          {message.type === NotificationType.INFO ? <InfoIcon /> : <AlertCircle />}
          <AlertTitle>
              {message.title}
          </AlertTitle>
          <AlertDescription className="flex flex-row items-end items-center gap-2">
              {message.message}
              {message.actionButton && (
                <AsyncButton variant="link" className="p-0 h-auto" onClick={message.actionButton.onClick}>
                  {message.actionButton.label}
                </AsyncButton>
              )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
});

interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  }
}

enum NotificationType {
  INFO = "info",
  WARNING = "warning"
}