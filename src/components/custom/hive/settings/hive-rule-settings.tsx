import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldContent, FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import { observer } from "mobx-react-lite";
import { useObservableDraft } from "../../utility/observable-draft";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/lib/contexts";
import { HiveDto, HiveUserDto, MemberRole } from "@/lib/Api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRoleRank } from "@/lib/utils";
import { Trans, useTranslation } from "react-i18next";

export interface HiveRuleSettingsProps {
  hiveDto: HiveDto;
  currentUser: HiveUserDto;
}

export const HiveRuleSettings = observer(({ hiveDto, currentUser }: HiveRuleSettingsProps) => {
  const { t } = useTranslation();
  const [hive, isDirty, resetChanges, applyChanges] = useObservableDraft(hiveDto);

  async function saveSettings() {
    const task = api.api.hiveUpdatePartialUpdate(hive);
    toast.promise(task, {
      loading: t("toasts:settings.saving"),
      success: t("toasts:settings.saved")
    });

    applyChanges();
  }

  function canEdit() {
    return getRoleRank(currentUser.role!) >= getRoleRank(MemberRole.Admin);
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldSet className="gap-2">
        <FieldLegend className="my-2">{t("hives:settings.rulesSection.visibility")}</FieldLegend>
        <FieldDescription>
          {t("hives:settings.rulesSection.visibilityDescription")}
        </FieldDescription>

        <FieldGroup className="bg-muted p-2 border-1 rounded-md gap-4">
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>{t("hives:settings.rulesSection.privateHive")}</FieldLabel>
              <FieldDescription>
                {t("hives:settings.rulesSection.privateHiveDescription")}
              </FieldDescription>
            </FieldContent>
            <Switch
              checked={hive.settings?.isPrivate ?? false}
              onCheckedChange={(checked) => hive.settings!.isPrivate = checked}
              disabled={!canEdit()}
            />
          </Field>

          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>{t("hives:settings.rulesSection.requireApprovalToJoin")}</FieldLabel>
              <FieldDescription>
                {t("hives:settings.rulesSection.requireApprovalToJoinDescription")}
              </FieldDescription>
            </FieldContent>
            <Switch
              checked={hive.settings?.joinRequiresApproval ?? false}
              onCheckedChange={(checked) => hive.settings!.joinRequiresApproval = checked}
              disabled={!canEdit()}
            />
          </Field>

          <Field>
            <FieldContent className="gap-1">
              <FieldLabel>{t("hives:settings.rulesSection.honeyRequiredToJoin")}</FieldLabel>
              <FieldDescription>
                <Trans
                  i18nKey="hives:settings.rulesSection.honeyRequiredToJoinDescription"
                  components={{
                    honey: <span className="text-honey-brown">🍯 {hive.settings?.minHoneyToJoin ?? 0}</span>
                  }}
                />
              </FieldDescription>
            </FieldContent>
            <Input
              className="max-w-64"
              type="number"
              value={hive.settings?.minHoneyToJoin ?? 0}
              onChange={(e) => hive.settings!.minHoneyToJoin = Number(e.target.value)}
              disabled={!canEdit()}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-2">
        <FieldLegend className="my-2">{t("hives:settings.rulesSection.posting")}</FieldLegend>
        <FieldDescription>
          {t("hives:settings.rulesSection.postingDescription")}
        </FieldDescription>

        <FieldGroup className="bg-muted p-2 border-1 rounded-md gap-4">
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>{t("hives:settings.rulesSection.requireApprovalToPost")}</FieldLabel>
              <FieldDescription>
                {t("hives:settings.rulesSection.requireApprovalToPostDescription")}
              </FieldDescription>
            </FieldContent>
            <Switch
              checked={hive.settings?.postRequiresApproval ?? false}
              onCheckedChange={(checked) => hive.settings!.postRequiresApproval = checked}
              disabled={!canEdit()}
            />
          </Field>

          <Field>
            <FieldContent className="gap-1">
              <FieldLabel>{t("hives:settings.rulesSection.honeyRequiredToPost")}</FieldLabel>
              <FieldDescription>
                <Trans
                  i18nKey="hives:settings.rulesSection.honeyRequiredToPostDescription"
                  components={{
                    honey: <span className="text-honey-brown">🍯 {hive.settings?.minHoneyToPost ?? 0}</span>
                  }}
                />
              </FieldDescription>
            </FieldContent>
            <Input
              className="max-w-64"
              type="number"
              value={hive.settings?.minHoneyToPost ?? 0}
              onChange={(e) => hive.settings!.minHoneyToPost = Number(e.target.value)}
              disabled={!canEdit()}
            />
          </Field>

          <Field>
            <FieldContent className="gap-1">
              <FieldLabel>{t("hives:settings.rulesSection.whoCanPost")}</FieldLabel>
              <FieldDescription>
                {t("hives:settings.rulesSection.whoCanPostDescription")}
              </FieldDescription>
            </FieldContent>

            <Select
              value={hive.settings?.minRoleToPost ?? MemberRole.Guest}
              onValueChange={(value) => hive.settings!.minRoleToPost = value as MemberRole}
              disabled={!canEdit()}
            >
              <SelectTrigger className="max-w-64">
                <SelectValue placeholder={t("hives:settings.rulesSection.selectGroup")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MemberRole.Guest}>{t("enums:memberRole.anyone")}</SelectItem>
                <SelectItem value={MemberRole.Follower}>{t("enums:memberRole.followers")}</SelectItem>
                <SelectItem value={MemberRole.Moderator}>{t("enums:memberRole.moderators")}</SelectItem>
                <SelectItem value={MemberRole.Admin}>{t("enums:memberRole.admins")}</SelectItem>
                <SelectItem value={MemberRole.Creator}>{t("enums:memberRole.creator")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-2">
        <FieldLegend className="my-2">{t("hives:settings.rulesSection.commenting")}</FieldLegend>
        <FieldDescription>
          {t("hives:settings.rulesSection.commentingDescription")}
        </FieldDescription>

        <FieldGroup className="bg-muted p-2 border-1 rounded-md gap-4">
          <Field>
            <FieldContent className="gap-1">
              <FieldLabel>{t("hives:settings.rulesSection.honeyRequiredToComment")}</FieldLabel>
              <FieldDescription>
                <Trans
                  i18nKey="hives:settings.rulesSection.honeyRequiredToCommentDescription"
                  components={{
                    honey: <span className="text-honey-brown">🍯 {hive.settings?.minHoneyToComment ?? 0}</span>
                  }}
                />
              </FieldDescription>
            </FieldContent>
            <Input
              className="max-w-64"
              type="number"
              value={hive.settings?.minHoneyToComment ?? 0}
              onChange={(e) => hive.settings!.minHoneyToComment = Number(e.target.value)}
              disabled={!canEdit()}
            />
          </Field>

          <Field>
            <FieldContent className="gap-1">
              <FieldLabel>{t("hives:settings.rulesSection.whoCanComment")}</FieldLabel>
              <FieldDescription>
                {t("hives:settings.rulesSection.whoCanCommentDescription")}
              </FieldDescription>
            </FieldContent>

            <Select
              value={hive.settings?.minRoleToComment ?? MemberRole.Guest}
              onValueChange={(value) => hive.settings!.minRoleToComment = value as MemberRole}
              disabled={!canEdit()}
            >
              <SelectTrigger className="max-w-64">
                <SelectValue placeholder={t("hives:settings.rulesSection.selectGroup")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MemberRole.Guest}>{t("enums:memberRole.anyone")}</SelectItem>
                <SelectItem value={MemberRole.Follower}>{t("enums:memberRole.followers")}</SelectItem>
                <SelectItem value={MemberRole.Moderator}>{t("enums:memberRole.moderators")}</SelectItem>
                <SelectItem value={MemberRole.Admin}>{t("enums:memberRole.admins")}</SelectItem>
                <SelectItem value={MemberRole.Creator}>{t("enums:memberRole.creator")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="self-end flex flex-row gap-2 mt-2">
        <Button variant="outline" disabled={!isDirty()} onClick={resetChanges}>
          {t("common:reset")}
        </Button>
        <Button onClick={saveSettings} disabled={!isDirty()}>
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
});
