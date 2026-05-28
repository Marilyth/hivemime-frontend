import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { observer } from "mobx-react-lite";
import { useObservableDraft } from "../../utility/observable-draft";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";

import { toast } from "sonner";
import { AsyncButton } from "../../utility/async-button";
import { api } from "@/lib/contexts";
import { HiveDto, HiveUserDto, MemberRole } from "@/lib/Api";
import { Textarea } from "@/components/ui/textarea";
import { getRoleRank } from "@/lib/utils";

export interface HiveGeneralSettingsProps {
  hiveDto: HiveDto;
  currentUser: HiveUserDto;
}

export const HiveGeneralSettings = observer(({ hiveDto, currentUser }: HiveGeneralSettingsProps) => {
  const [hive, isDirty, resetChanges, applyChanges] = useObservableDraft(hiveDto);

  async function saveSettings() {
    const task = api.api.hiveUpdatePartialUpdate(hive);
    toast.promise(task, {
      loading: "Saving your settings...",
      success: "Your settings have been saved."
    });

    applyChanges();
  }

  function getErrors() {
    const errors: string[] = [];

    if (!hive.name || hive.name.trim().length < 3)
      errors.push("Hive name must be at least 3 characters long.");

    return errors;
  }

  function canEdit() {
    return getRoleRank(currentUser.role!) >= getRoleRank(MemberRole.Admin);
  }

  return (
    <div className="flex flex-col gap-4">
      <Field className="gap-1">
        <FieldLabel>Name</FieldLabel>
        <FieldDescription>The hive&apos;s name.</FieldDescription>
        <Input disabled={!canEdit()} value={hive.name!} onChange={(e) => hive.name = e.target.value} autoComplete="off" placeholder="Hive name" />
      </Field>

      <Field className="gap-1">
        <FieldLabel>Description</FieldLabel>
        <FieldDescription>The hive&apos;s description.</FieldDescription>
        <Textarea disabled={!canEdit()} value={hive.description!} onChange={(e) => hive.description = e.target.value} autoComplete="off" placeholder="Hive description" />
      </Field>

      <div className="text-sm text-destructive">
        {getErrors().map((error, index) => (
          <HiveMimeBulletItem key={index}>{error}</HiveMimeBulletItem>
        ))}
      </div>

      <div className="self-end flex flex-row gap-2 mt-2">
        <Button variant="outline" disabled={!isDirty()} onClick={resetChanges}>Reset</Button>
        <AsyncButton onClick={saveSettings} disabled={!isDirty() || getErrors().length > 0}>Save</AsyncButton>
      </div>
    </div>
  );
});