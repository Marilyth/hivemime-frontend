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
      <FieldSet className="gap-2">
        <FieldLegend className="my-2">Visibility</FieldLegend>
        <FieldDescription>
          Control who can see and join this hive.
        </FieldDescription>

        <FieldGroup className="bg-muted p-2 border-1 rounded-md gap-4">
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>Private hive</FieldLabel>
              <FieldDescription>
                Only members can view this hive, and it will not show up when browsing hives.
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
              <FieldLabel>Require approval to join</FieldLabel>
              <FieldDescription>
                Users must be approved before they can join this hive.
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
              <FieldLabel>Honey required to join</FieldLabel>
              <FieldDescription>
                Users must have at least{" "}
                <span className="text-honey-brown">
                  🍯 {hive.settings?.minHoneyToJoin ?? 0}
                </span>{" "}
                to join this hive.
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
        <FieldLegend className="my-2">Posting</FieldLegend>
        <FieldDescription>
          Control who can create posts in this hive.
        </FieldDescription>

        <FieldGroup className="bg-muted p-2 border-1 rounded-md gap-4">
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>Require approval to post</FieldLabel>
              <FieldDescription>
                Posts must be approved before they can be published in this hive.
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
              <FieldLabel>Honey required to post</FieldLabel>
              <FieldDescription>
                Users must have at least{" "}
                <span className="text-honey-brown">
                  🍯 {hive.settings?.minHoneyToPost ?? 0}
                </span>{" "}
                to post in this hive.
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
              <FieldLabel>Who can post</FieldLabel>
              <FieldDescription>
                Users must at least be part of the following group to post in this hive.
              </FieldDescription>
            </FieldContent>

            <Select
              value={hive.settings?.minRoleToPost ?? MemberRole.Guest}
              onValueChange={(value) => hive.settings!.minRoleToPost = value as MemberRole}
              disabled={!canEdit()}
            >
              <SelectTrigger className="max-w-64">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MemberRole.Guest}>Anyone</SelectItem>
                <SelectItem value={MemberRole.Follower}>Followers</SelectItem>
                <SelectItem value={MemberRole.Moderator}>Moderators</SelectItem>
                <SelectItem value={MemberRole.Admin}>Admins</SelectItem>
                <SelectItem value={MemberRole.Creator}>Creator</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-2">
        <FieldLegend className="my-2">Commenting</FieldLegend>
        <FieldDescription>
          Control who can comment on posts in this hive.
        </FieldDescription>

        <FieldGroup className="bg-muted p-2 border-1 rounded-md gap-4">
          <Field>
            <FieldContent className="gap-1">
              <FieldLabel>Honey required to comment</FieldLabel>
              <FieldDescription>
                Users must have at least{" "}
                <span className="text-honey-brown">
                  🍯 {hive.settings?.minHoneyToComment ?? 0}
                </span>{" "}
                to comment in this hive.
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
              <FieldLabel>Who can comment</FieldLabel>
              <FieldDescription>
                Users must at least be part of the following group to comment in this hive.
              </FieldDescription>
            </FieldContent>

            <Select
              value={hive.settings?.minRoleToComment ?? MemberRole.Guest}
              onValueChange={(value) => hive.settings!.minRoleToComment = value as MemberRole}
              disabled={!canEdit()}
            >
              <SelectTrigger className="max-w-64">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MemberRole.Guest}>Anyone</SelectItem>
                <SelectItem value={MemberRole.Follower}>Followers</SelectItem>
                <SelectItem value={MemberRole.Moderator}>Moderators</SelectItem>
                <SelectItem value={MemberRole.Admin}>Admins</SelectItem>
                <SelectItem value={MemberRole.Creator}>Creator</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="self-end flex flex-row gap-2 mt-2">
        <Button variant="outline" disabled={!isDirty()} onClick={resetChanges}>
          Reset
        </Button>
        <Button onClick={saveSettings} disabled={!isDirty()}>
          Save
        </Button>
      </div>
    </div>
  );
});