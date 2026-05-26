import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldContent, FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import { observer } from "mobx-react-lite";
import { useObservableDraft } from "../../utility/observable-draft";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/lib/contexts";
import { HiveDto, HiveUserDto, MemberRole, PostPolicy } from "@/lib/Api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRoleRank } from "@/lib/utils";

export interface HiveRuleSettingsProps {
  hiveDto: HiveDto;
  currentUser: HiveUserDto;
}

export const HiveRuleSettings = observer(({ hiveDto, currentUser }: HiveRuleSettingsProps) => {
  const [hive, isDirty, resetChanges, applyChanges] = useObservableDraft(hiveDto);

  async function saveSettings() {
    const task = api.api.hiveUpdatePartialUpdate(hive);
    toast.promise(task, {
      loading: "Saving your settings...",
      success: "Your settings have been saved."
    });

    applyChanges();
  }

  function canEdit() {
    return getRoleRank(currentUser.role!) >= getRoleRank(MemberRole.Admin);
  }

  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <FieldContent className="gap-1">
          <FieldLabel>Require approval to post</FieldLabel>
          <FieldDescription>
            Posts must be approved before they can be published in this hive.
          </FieldDescription>
        </FieldContent>
        <Switch checked={hive.settings?.mustBeApprovedToPost ?? false} onCheckedChange={(checked) => hive.settings!.mustBeApprovedToPost = checked} disabled={!canEdit()} />
      </Field>

      <Field orientation="horizontal">
        <FieldContent className="gap-1">
          <FieldLabel>Require approval to join</FieldLabel>
          <FieldDescription>
            Users must be approved before they can join this hive.
          </FieldDescription>
        </FieldContent>
        <Switch checked={hive.settings?.mustBeApprovedToJoin ?? false} onCheckedChange={(checked) => hive.settings!.mustBeApprovedToJoin = checked} disabled={!canEdit()} />
      </Field>

      <Field>
        <FieldContent className="gap-1">
          <FieldLabel>Reputation</FieldLabel>
          <FieldDescription>
            Users must have at least <span className="text-honey-brown">🍯 {hive.settings?.minHoneyToPost ?? 0}</span> to be allowed to post in this hive.
          </FieldDescription>
        </FieldContent>
        <Input className="max-w-64" type="number" value={hive.settings?.minHoneyToPost ?? 0} onChange={(e) => hive.settings!.minHoneyToPost = Number(e.target.value)} disabled={!canEdit()} />
      </Field>

      <Field>
        <FieldContent className="gap-1">
          <FieldLabel>Who can post</FieldLabel>
          <FieldDescription>
            Users must be part of the following group to be able to post in this hive.
          </FieldDescription>
        </FieldContent>

        <Select value={hive.settings?.postPolicy ?? ""} onValueChange={(value) => hive.settings!.postPolicy = value as PostPolicy} disabled={!canEdit()}>
          <SelectTrigger className="max-w-64">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Anyone">Anyone</SelectItem>
            <SelectItem value="FollowersOnly">Followers</SelectItem>
            <SelectItem value="ModeratorsOnly">Moderators</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <div className="self-end flex flex-row gap-2 mt-2">
        <Button variant="outline" disabled={!isDirty()} onClick={resetChanges}>Reset</Button>
        <Button onClick={saveSettings} disabled={!isDirty()}>Save</Button>
      </div>
    </div>
  );
});