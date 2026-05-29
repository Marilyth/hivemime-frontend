"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateHiveDto } from "@/lib/Api";
import { useRef } from "react";
import { api, followedHivesStore } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { toast } from "sonner";
import { observable } from "mobx";
import { useRouter } from "next/navigation";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AsyncButton } from "../../utility/async-button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";


export const HiveMimeHiveCreate = observer(() => {
  const { t } = useTranslation();
  const hiveRef = useRef<CreateHiveDto>(observable({ name: "", description: "" }));
  const router = useRouter();

  function canCreateHive() {
    const errors: string[] = [];

    if (hiveRef.current.name!.trim().length < 3)
      errors.push(t("validation:hive.nameTooShort"));

    for(const error of errors)
      toast.error(error);

    return errors.length === 0;
  }

  async function createHive() {
    if (!canCreateHive())
      return;

    const task = api.api.hiveCreateCreate(hiveRef.current);
    toast.promise(task, {
      loading: t("toasts:hive.creating"),
      success: (response) => {
        followedHivesStore.addFollowedHive(response.data);
        router.push(`/hives/settings?hiveId=${response.data.hive!.id}`);

        return t("toasts:hive.created");
      }
    });

    await task;
  }

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>
          {t("hives:create.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Field className="mb-4 gap-1">
          <FieldLabel>{t("hives:create.name")}</FieldLabel>
          <Input placeholder={t("hives:create.namePlaceholder")} value={hiveRef.current.name!} onChange={(e) => hiveRef.current.name = e.target.value} />
        </Field>
        <Field>
          <FieldLabel>{t("hives:create.description")}</FieldLabel>
          <Textarea placeholder={t("hives:create.descriptionPlaceholder")} value={hiveRef.current.description!} onChange={(e) => hiveRef.current.description = e.target.value} />
        </Field>
      </CardContent>
      <CardFooter>
        <AsyncButton className="self-start ml-auto" onClick={createHive}>
          {t("common:create")}
        </AsyncButton>
      </CardFooter>
    </Card>
  );
});
