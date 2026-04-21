import { UserContext } from "@/lib/contexts";
import { getCurrentUser, sendVerificationEmail } from "@/lib/firebase";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { InfoIcon, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

export function NotificationBanner() {
  const userContext = useContext(UserContext);
  const [messages, setMessages] = useState<Notification[]>([]);

  async function getMessages() {
    const messages: Notification[] = [];

    if (userContext?.user){
        const firebaseUser = await getCurrentUser();

        if (firebaseUser?.isAnonymous) {
            messages.push({
                type: NotificationType.WARNING,
                title: "Guest account",
                message: "Please log in to save your data and access all features.",
            });
        }
        else if (!firebaseUser?.emailVerified) {
            messages.push({
                type: NotificationType.WARNING,
                title: "Email verification",
                message: "Please verify your email to access all features.",
                actionButton: {
                    label: "Send email",
                    onClick: async () => {
                        toast.promise(sendVerificationEmail(), {
                            loading: "Sending verification email...",
                            success: "Email sent. Please also check your spam folder.",
                            error: "Failed to send verification email. Please try again."
                        });
                    }
                }
            });
        }
    }

    setMessages(messages);
  }

  useEffect(() => {
    getMessages();
  }, [userContext?.user]);

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
                <Button variant="link" className="p-0 h-auto" onClick={message.actionButton.onClick}>
                  {message.actionButton.label}
                </Button>
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