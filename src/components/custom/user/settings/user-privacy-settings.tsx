import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldContent, FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useObservableDraft } from "../../utility/observable-draft";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { Switch } from "@/components/ui/switch";

export const UserPrivacySettings = observer(() => {
  const userContext = useContext(UserContext);
  const [user, isDirty, resetChanges] = useObservableDraft(userContext!.user!);

  async function saveSettings() {
    // ToDo...
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldSet className="gap-2">
        <FieldLegend className="my-2">Auto polls</FieldLegend>
        <FieldDescription>When voting on polls, you also participate in &quot;auto polls&quot; collecting meta information. You can <span className="text-honey-brown">opt out</span> of these polls. This will apply retroactively.</FieldDescription>

        <FieldGroup className="bg-muted p-2 border-1 rounded-md gap-4">
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>Age group</FieldLabel>
              <FieldDescription>Your age group will be counted.</FieldDescription>
            </FieldContent>
            <Switch checked={user.settings?.shareAgeOnVote ?? false} onCheckedChange={(checked) => (user.settings!.shareAgeOnVote = checked)} />
          </Field>
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>Country</FieldLabel>
              <FieldDescription>Your country will be counted.</FieldDescription>
            </FieldContent>
            <Switch checked={user.settings?.shareCountryOnVote ?? false} onCheckedChange={(checked) => (user.settings!.shareCountryOnVote = checked)} />
          </Field>
          <Field orientation="horizontal">
            <FieldContent className="gap-1">
              <FieldLabel>Date of vote</FieldLabel>
              <FieldDescription>Your date of vote will be counted.</FieldDescription>
            </FieldContent>
            <Switch checked={user.settings?.shareDateOnVote ?? false} onCheckedChange={(checked) => (user.settings!.shareDateOnVote = checked)} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <Field orientation="horizontal">
        <FieldContent className="gap-1">
          <FieldLabel>Protect votes from filtering</FieldLabel>
          <FieldDescription>
            When results are filtered by conditions, your votes are excluded to prevent them from being inferred.
          </FieldDescription>
        </FieldContent>
        <Switch checked={false} onCheckedChange={(checked) => console.log("ToDo")} />
      </Field>

      <div className="self-end flex flex-row gap-2 mt-2">
        <Button variant="outline" disabled={!isDirty()} onClick={resetChanges}>Reset</Button>
        <Button onClick={saveSettings} disabled={!isDirty()}>Save</Button>
      </div>
    </div>
  );
});