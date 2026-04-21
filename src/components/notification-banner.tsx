import { UserContext } from "@/lib/contexts";
import { getCurrentUser, refreshUser, sendVerificationEmail } from "@/lib/firebase";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { InfoIcon, AlertCircle } from "lucide-react";
import { AsyncButton } from "./custom/utility/async-button";

export function NotificationBanner() {
  const userContext = useContext(UserContext);
  const [messages, setMessages] = useState<Notification[]>([]);
  const [hasSentVerificationEmail, setHasSentVerificationEmail] = useState<boolean>(false);

  async function getMessages() {
    const messages: Notification[] = [];

    if (userContext?.user){
        const firebaseUser = await getCurrentUser();

        if (!firebaseUser?.emailVerified && firebaseUser?.email) {
            messages.push({
                type: NotificationType.WARNING,
                title: "Email verification",
                message: "Please verify your email to access all features.",
                actionButton: {
                    label: hasSentVerificationEmail ? "Reload" : "Send email",
                    onClick: async () => {
                      if (hasSentVerificationEmail) {
                        setHasSentVerificationEmail(false);
                        await refreshUser();
                        userContext.setUser(null);
                      }
                      else {
                        const task = sendVerificationEmail();
                        toast.promise(task, {
                          loading: "Sending verification email...",
                          success: () =>{
                            setHasSentVerificationEmail(true);
                            return "Email sent. Please also check your spam folder."
                          },
                          error: "Failed to send verification email. Please try again."
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
    getMessages();
  }, [userContext?.user, hasSentVerificationEmail]);

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
}

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