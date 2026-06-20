import { AlertDialogHeader, AlertDialogFooter, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialog } from "@/components/ui/alert-dialog";
import React from "react";
import { useTranslation } from "react-i18next";

type WarningProps = {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "destructive" | "default" | "outline";
  children: React.ReactElement;
}

export const WarningWrapper = ({ title, description, confirmText, cancelText, confirmVariant, children }: WarningProps) => {
  const { t } = useTranslation();

  if (!children)
    return null;
  
  const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;

  const trigger = React.cloneElement(child, {
    onClick: undefined,
  });
  
  if (!title)
    title = t("common:areYouSure");

  if (!confirmText)
    confirmText = t("common:confirm");

  if (!cancelText)
    cancelText = t("common:cancel");

  if (!confirmVariant)
    confirmVariant = "destructive";

  function confirm(e: React.MouseEvent<HTMLButtonElement>) {
    child.props.onClick?.(e);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 gap-0 max-w-sm!">
        <AlertDialogHeader className="p-4 border-b bg-muted">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="p-2">
          <AlertDialogCancel variant="outline">{cancelText}</AlertDialogCancel>
          <AlertDialogAction variant={confirmVariant} onClick={confirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}