"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HiveMimeCreatePoll } from "./hm-create-poll";
import { EmbeddedTabs, EmbeddedTabsContent, EmbeddedTabsList, EmbeddedTabsTrigger } from "../hm-embedded-tabs";
import { Api, CreatePostDto } from "@/lib/Api";
import { InputWithLabel, TextAreaWithLabel } from "../labelled-input";
import { Button } from "../../button";
import { useContext, useRef, useState } from "react";
import { HiveMimeApiContext } from "@/app/layout";
import { Label } from "@radix-ui/react-label";
import { observer } from "mobx-react-lite";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Separator } from "../../separator";
import { PollCreationValidation } from "@/models/PollCreationValidation";
import { observable } from "mobx";
import { toast } from "sonner";

export const HiveMimeCreatePost = observer(() => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [selectedQuestion, setSelectedQuestion] = useState<string>("1");
  const validationsRef = useRef<PollCreationValidation[]>(observable([]));
  const validations = validationsRef.current;
  const postRef = useRef<CreatePostDto>(observable({ title: "", description: "", polls: [] }));
  const post = postRef.current;

  if (post.polls!.length === 0) {
    addPoll();
  }

  function addPoll() {
    validations.push({ isValid: false, errors: [] });
    post.polls?.push({ title: "", description: "", candidates: [], categories: [],
                       minValue: 1, maxValue: 1, minVotes: 1, maxVotes: 1, stepValue: 1,
                       pollType: undefined });
    setSelectedQuestion(`${post.polls!.length}`);
  }

  function removePoll(index: number) {
    post.polls?.splice(index, 1);
    validations.splice(index, 1);

    // If the removed poll was the last one, select the previous one.
    // (The value is 1-based, the index is 0-based)
    if (index >= post.polls!.length)
      setSelectedQuestion(`${index}`);
  }

  function canSubmitPost() {
    const errors: string[] = [];

    // A post must have a title.
    if (post.title == undefined || post.title.trim() === "")
      errors.push("A post must have a title.");

    for (let i = 0; i < validations.length; i++) {
      if (!validations[i].isValid) {
        errors.push(`Poll ${i + 1}: ${validations[i].errors.join(", ")}`);
      }
    }

    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i]);
      }
    }

    return errors.length === 0;
  }

  async function submitPost() {
    if (!canSubmitPost())
      return;

    await hiveMimeService.api.postCreateCreate(post);

    toast.success("Post created successfully!");
    redirect("/home");
  }

  return (
    <Card className="py-4 text-foreground">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create new post</h2>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          <InputWithLabel isRequired label="Title" placeholder="My title" value={post.title!}
            onChange={(e) => post.title = e.target.value} />
          <TextAreaWithLabel label="Description" placeholder="My description" value={post.description!}
            onChange={(e) => post.description = e.target.value} />

          <Separator className="mt-8" orientation="horizontal" />
          <Label>Polls</Label>
          <EmbeddedTabs value={selectedQuestion} onValueChange={setSelectedQuestion}>
            <EmbeddedTabsList actionComponent={
                <Button variant="outline" className="rounded-b-none border-b-0" onClick={addPoll}>
                  <Plus />Add
                </Button>
            }>
              {post.polls!.map((subPoll, index) => (
                <EmbeddedTabsTrigger
                  className={`${validations[index].isValid ? '' : 'text-red-500'}`}
                  key={index} value={`${index + 1}`}>{index + 1}</EmbeddedTabsTrigger>
              ))}
            </EmbeddedTabsList>
            {post.polls!.map((poll, index) => (
              <EmbeddedTabsContent key={index} value={`${index + 1}`}>
                <HiveMimeCreatePoll validation={validations[index]} poll={poll} canDelete={post.polls!.length > 1} onDeleteRequested={() => removePoll(index)} />
              </EmbeddedTabsContent>
            ))}
          </EmbeddedTabs>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={submitPost}>Submit</Button>
      </CardFooter>
    </Card>
  );
});
