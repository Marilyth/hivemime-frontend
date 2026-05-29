import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { observer } from "mobx-react-lite";
import { useObservableDraft } from "../../utility/observable-draft";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AsyncButton } from "../../utility/async-button";
import { api, userStore } from "@/lib/contexts";
import { useTranslation } from "react-i18next";

countries.registerLocale(en);
const options = Object.entries(countries.getNames("en", { select: "official" }))
  .map(([code, name]) => ({ value: code, label: name }));

export const UserAccountSettings = observer(() => {
  const { t } = useTranslation();
  const [user, isDirty, resetChanges] = useObservableDraft(userStore.user!);

  const minDateOfBirth = new Date();
  minDateOfBirth.setFullYear(minDateOfBirth.getFullYear() - 130);
  const maxDateOfBirth = new Date();
  maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 13);

  async function saveSettings() {
    const task = api.api.userUpdateCreate(user);
    toast.promise(task, {
      loading: t("toasts:settings.saving"),
      success: t("toasts:settings.saved")
    });

    userStore.setUser((await task).data);
  }

  function getErrors() {
    const errors: string[] = [];

    if (!user.username || user.username.trim().length < 3)
      errors.push(t("validation:user.usernameTooShort"));

    if (user.dateOfBirth) {
      if (user.dateOfBirth > maxDateOfBirth.toISOString().split("T")[0])
        errors.push(t("validation:user.tooYoung"));

      else if (user.dateOfBirth < minDateOfBirth.toISOString().split("T")[0])
        errors.push(t("validation:user.tooOld"));
    }

    return errors;
  }

  return (
    <div className="flex flex-col gap-4">
      <Field className="gap-1">
        <FieldLabel>{t("settings:user.displayName")}</FieldLabel>
        <FieldDescription>{t("settings:user.displayNameDescription")}</FieldDescription>
        <Input value={user.username!} onChange={(e) => user.username = e.target.value} autoComplete="off" placeholder={t("settings:user.displayNamePlaceholder")} />
      </Field>
      <Field className="gap-1">
        <FieldLabel>{t("settings:user.birthday")}</FieldLabel>
        <FieldDescription>{t("settings:user.birthdayDescription")}</FieldDescription>
        <Input value={user.dateOfBirth ?? ""} onChange={(e) => user.dateOfBirth = e.target.value} autoComplete="off" type="date"
          min={minDateOfBirth.toISOString().split("T")[0]}
          max={maxDateOfBirth.toISOString().split("T")[0]} />
      </Field>

      <Field className="gap-1">
        <FieldLabel>{t("settings:user.country")}</FieldLabel>
        <FieldDescription>{t("settings:user.countryDescription")}</FieldDescription>
        <Select value={user.settings!.country ?? ""} onValueChange={(value) => user.settings!.country = value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("settings:user.countryPlaceholder")} />
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
        <Button variant="outline" disabled={!isDirty()} onClick={resetChanges}>{t("common:reset")}</Button>
        <AsyncButton onClick={saveSettings} disabled={!isDirty() || getErrors().length > 0}>{t("common:save")}</AsyncButton>
      </div>
    </div>
  );
});