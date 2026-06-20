import { observer } from "mobx-react-lite";
import { confirmStore } from "./contexts";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

export const ConfirmDialog = observer(() => {
  const { t } = useTranslation();

  return (
      <AlertDialog open={confirmStore.confirmProps !== null}>
      <AlertDialogContent className="p-0 gap-0 max-w-sm!">
        <AlertDialogHeader className="p-4 border-b bg-muted">
          <AlertDialogTitle>{confirmStore.confirmProps?.title ?? t("common:areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{confirmStore.confirmProps?.description ?? t("common:confirmProceed")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="p-2">
          <AlertDialogCancel variant="outline" onClick={() => confirmStore.respond(false)}>
            {confirmStore.confirmProps?.cancelText ?? t("common:cancel")}
          </AlertDialogCancel>
          <AlertDialogAction variant={confirmStore.confirmProps?.confirmVariant ?? "destructive"} onClick={() => confirmStore.respond(true)}>
            {confirmStore.confirmProps?.confirmText ?? t("common:confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});