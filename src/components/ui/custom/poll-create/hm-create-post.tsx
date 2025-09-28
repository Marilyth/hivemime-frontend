"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HiveMimeCreatePoll } from "./hm-create-poll";
import { EmbeddedTabs, EmbeddedTabsContent, EmbeddedTabsList, EmbeddedTabsTrigger } from "../hm-embedded-tabs";
import { Api, CreatePostDto } from "@/lib/Api";
import { InputWithLabel } from "../labelled-input";
import { Button } from "../../button";
import { useContext, useRef, useState } from "react";
import { HiveMimeApiContext } from "@/app/layout";
import { createObservable } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { observer } from "mobx-react-lite";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Separator } from "../../separator";

export const HiveMimeCreatePost = observer(() => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [selectedQuestion, setSelectedQuestion] = useState<string>("1");
  const postRef = useRef<CreatePostDto>(createObservable({ title: "", description: "", polls: [] }));
  const post = postRef.current;

  if (post.polls!.length === 0) {
    addPoll();
  }

  function addPoll() {
    post.polls?.push({ title: "", description: "", candidates: [] });
    setSelectedQuestion(`${post.polls!.length}`);
  }

  function removePoll(index: number) {
    post.polls?.splice(index, 1);

    // If the removed poll was the last one, select the previous one.
    // (The value is 1-based, the index is 0-based)
    if (index >= post.polls!.length)
      setSelectedQuestion(`${index}`);
  }

  function canSubmitPost() {
    // A post must have a title.
    if (post.title == undefined || post.title.trim() === "")
      return false;

    // A poll must have candidates and a type.
    if (post.polls?.some(poll => poll.pollType == undefined ||
                                 poll.candidates?.length == 0))
      return false;

    return true;
  }

  async function submitPost() {
    await hiveMimeService.api.postCreateCreate(post);
    redirect("/home");
  }

  return (
    <Card className="py-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create new post</h2>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          <InputWithLabel isRequired label="Title" placeholder="My title" value={post.title!}
            onChange={(e) => post.title = e.target.value} />
          <InputWithLabel label="Description" placeholder="My description" value={post.description!}
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
                <EmbeddedTabsTrigger key={index} value={`${index + 1}`}>{index + 1}</EmbeddedTabsTrigger>
              ))}
            </EmbeddedTabsList>
            {post.polls!.map((poll, index) => (
              <EmbeddedTabsContent key={index} value={`${index + 1}`}>
                <HiveMimeCreatePoll poll={poll} canDelete={post.polls!.length > 1} onDeleteRequested={() => removePoll(index)} />
              </EmbeddedTabsContent>
            ))}
          </EmbeddedTabs>
        </div>
      </CardContent>

      <CardFooter>
        <Button disabled={!canSubmitPost()} onClick={submitPost}>Submit</Button>
      </CardFooter>
    </Card>
  );
});
