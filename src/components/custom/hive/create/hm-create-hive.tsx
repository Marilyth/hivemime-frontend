"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Api, CreateHiveDto } from "@/lib/Api";
import { useContext, useRef } from "react";
import { FollowedHivesContext, HiveMimeApiContext } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { toast } from "sonner";
import { observable } from "mobx";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AsyncButton } from "../../utility/async-button";


export const HiveMimeHiveCreate = observer(() => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const followedHivesContext = useContext(FollowedHivesContext)!;
  const hiveRef = useRef<CreateHiveDto>(observable({ name: "", description: "" }));
  const router = useRouter();

  function canCreateHive() {
    const errors: string[] = [];

    if (hiveRef.current.name!.trim().length < 3)
      errors.push("Hive names must be at least 3 characters long.");

    for(const error of errors)
      toast.error(error);

    return errors.length === 0;
  }

  async function createHive() {
    if (!canCreateHive())
      return;

    const task = hiveMimeService.api.hiveCreateCreate(hiveRef.current);
    toast.promise(task, {
      loading: 'Creating hive...',
      success: (response) => {
        followedHivesContext.setFollowedHives([...followedHivesContext.followedHives, response.data]);
        router.push(`/posts?hiveId=${response.data.id}`);

        return 'Hive created successfully!';
      }
    });

    await task;
  }

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>
          Create new hive
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Field className="mb-4 gap-1">
          <FieldLabel>Name</FieldLabel>
          <Input placeholder="Politics" value={hiveRef.current.name!} onChange={(e) => hiveRef.current.name = e.target.value} />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input placeholder="A community to discuss world politics." value={hiveRef.current.description!} onChange={(e) => hiveRef.current.description = e.target.value} />
        </Field>
      </CardContent>
      <CardFooter>
        <AsyncButton className="self-start ml-auto" onClick={createHive}>
          Create
        </AsyncButton>
      </CardFooter>
    </Card>
  );
});
