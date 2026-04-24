import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useObservableDraft } from "../../utility/observable-draft";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

countries.registerLocale(en);
const options = Object.entries(countries.getNames("en", { select: "official" }))
  .map(([code, name]) => ({ value: code, label: name }));

export const UserAccountSettings = observer(() => {
  const userContext = useContext(UserContext);
  const [user, isDirty, resetChanges] = useObservableDraft(userContext!.user!);

  const minDateOfBirth = new Date();
  minDateOfBirth.setFullYear(minDateOfBirth.getFullYear() - 130);
  const maxDateOfBirth = new Date();
  maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 13);

  async function saveSettings() {
    // ToDo...
  }

  function getErrors() {
    const errors: string[] = [];

    if (!user.username || user.username.trim().length < 3)
      errors.push("Username must be at least 3 characters long.");

    if (user.dateOfBirth) {
      if (user.dateOfBirth > maxDateOfBirth.toISOString().split("T")[0])
        errors.push("You must be at least 13 years old.");

      else if (user.dateOfBirth < minDateOfBirth.toISOString().split("T")[0])
        errors.push("You can't be more than 130 years old.");
    }

    return errors;
  }

  return (
    <div className="flex flex-col gap-4">
      <Field className="gap-1">
        <FieldLabel>Display name</FieldLabel>
        <FieldDescription>Your public facing name people will see you as.</FieldDescription>
        <Input value={user.username!} onChange={(e) => (user.username = e.target.value)} autoComplete="off" placeholder="Your name" />
      </Field>
      <Field className="gap-1">
        <FieldLabel>Birthday</FieldLabel>
        <FieldDescription>
          Used to gate inappropriate content, and participate in the <span className="text-honey-brown">Age group</span> auto poll.
        </FieldDescription>
        <Input value={user.dateOfBirth ?? ""} onChange={(e) => (user.dateOfBirth = e.target.value)} autoComplete="off" type="date"
          min={minDateOfBirth.toISOString().split("T")[0]}
          max={maxDateOfBirth.toISOString().split("T")[0]} />
      </Field>

      <Field className="gap-1">
        <FieldLabel>Country</FieldLabel>
        <FieldDescription>
          Used to recommend content, and participate in the <span className="text-honey-brown">Country</span> auto poll.
        </FieldDescription>
        <Select value={user.settings!.country ?? ""} onValueChange={(value) => (user.settings!.country = value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
        </Select>
      </Field>

      <div className="text-sm text-destructive">
        {getErrors().map((error, index) => (
          <HiveMimeBulletItem key={index}>{error}</HiveMimeBulletItem>
        ))}
      </div>

      <div className="self-end flex flex-row gap-2 mt-2">
        <Button variant="outline" disabled={!isDirty()} onClick={resetChanges}>Reset</Button>
        <Button onClick={saveSettings} disabled={!isDirty() || getErrors().length > 0}>Save</Button>
      </div>
    </div>
  );
});