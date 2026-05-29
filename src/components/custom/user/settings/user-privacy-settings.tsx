import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldContent, FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import { observer } from "mobx-react-lite";
import { useObservableDraft } from "../../utility/observable-draft";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api, userStore } from "@/lib/contexts";
import { useTranslation } from "react-i18next";

export const UserPrivacySettings = observer(() => {
  const { t } = useTranslation();
  const [user, isDirty, resetChanges] = useObservableDraft(userStore.user!);

  async function saveSettings() {
    const task = api.api.userUpdateCreate(user);
    toast.promise(task, {
      loading: t("toasts:settings.saving"),
      success: t("toasts:settings.saved")
    });

    userStore.setUser((await task).data);
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldSet className="gap-2">
        <FieldLegend className="my-2">{t("settings:user.autoPolls")}</FieldLegend>
        <FieldDescription>{t("settings:user.autoPollsDescription")}</FieldDescription>

        <FieldGroup className="bg-muted p-2 border-1 rounded-md gap-4">
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>{t("settings:user.ageGroup")}</FieldLabel>
              <FieldDescription>{t("settings:user.ageGroupDescription")}</FieldDescription>
            </FieldContent>
            <Switch checked={user.settings?.shareAgeOnVote ?? true} onCheckedChange={(checked) => user.settings!.shareAgeOnVote = checked} />
          </Field>
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>{t("settings:user.countryPoll")}</FieldLabel>
              <FieldDescription>{t("settings:user.countryPollDescription")}</FieldDescription>
            </FieldContent>
            <Switch checked={user.settings?.shareCountryOnVote ?? true} onCheckedChange={(checked) => user.settings!.shareCountryOnVote = checked} />
          </Field>
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>{t("settings:user.dateOfVote")}</FieldLabel>
              <FieldDescription>{t("settings:user.dateOfVoteDescription")}</FieldDescription>
            </FieldContent>
            <Switch checked={user.settings?.shareDateOnVote ?? true} onCheckedChange={(checked) => user.settings!.shareDateOnVote = checked} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <Field orientation="horizontal">
        <FieldContent className="gap-1">
          <FieldLabel>{t("settings:user.protectVotes")}</FieldLabel>
          <FieldDescription>{t("settings:user.protectVotesDescription")}</FieldDescription>
        </FieldContent>
        <Switch checked={user.settings?.protectVoteOnFilter ?? false} onCheckedChange={(checked) => user.settings!.protectVoteOnFilter = checked} />
      </Field>

      <div className="self-end flex flex-row gap-2 mt-2">
        <Button variant="outline" disabled={!isDirty()} onClick={resetChanges}>{t("common:reset")}</Button>
        <Button onClick={saveSettings} disabled={!isDirty()}>{t("common:save")}</Button>
      </div>
    </div>
  );
});