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
import { observable } from "mobx";
import { toast } from "sonner";
import { validatePostTitle as validatePost } from "@/lib/validation";
import { getReferenceId } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectValue } from "../../select";
import { HiveMimeInlineSelectTrigger } from "../hm-inline-select";
import { HiveMimeBulletItem } from "../hm-bullet-item";

export const HiveMimeCreatePost = observer(() => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [hasTitle, setHasTitle] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("1");
  const postRef = useRef<CreatePostDto>(observable({ title: "", description: "", polls: [] }));
  const post = postRef.current;

  if (post.polls!.length === 0) {
    addPoll();
  }

  function addPoll() {
    post.polls?.push({ title: "", description: "", candidates: [], categories: [],
                       minValue: 0, maxValue: undefined, minVotes: 1, maxVotes: undefined, stepValue: 1,
                       pollType: undefined });
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
    const errors: string[] = validatePost(post);

    for(const error of errors) {
      toast.error(error);
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
          <div>
              This post
              <Select
                value={hasTitle ? "true" : "false"}
                onValueChange={(value) => setHasTitle(value === "true")}>
                <HiveMimeInlineSelectTrigger>
                    <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                    <SelectItem value="true">does</SelectItem>
                    <SelectItem value="false">does not</SelectItem>
                </SelectContent>
              </Select>
              have a title.
          </div>
          {hasTitle &&
            <>
              <InputWithLabel label="Title" placeholder="Optionally, give your post a title." value={post.title!}
                onChange={(e) => post.title = e.target.value} />
              <TextAreaWithLabel label="Description" placeholder="Optionally, add a description." value={post.description!}
                onChange={(e) => post.description = e.target.value} />

              <Separator className="mt-8" orientation="horizontal" />
            </>
          }
          <Label>Polls</Label>
          <EmbeddedTabs value={selectedQuestion} onValueChange={setSelectedQuestion}>
            <EmbeddedTabsList actionComponent={
              <Button variant="outline" className="rounded-b-none border-b-0" onClick={addPoll}>
                <Plus />Add
              </Button>
            }>
              {post.polls!.map((subPoll, index) => (
                <EmbeddedTabsTrigger
                  key={getReferenceId(subPoll)} value={`${index + 1}`}>{index + 1}</EmbeddedTabsTrigger>
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
        <Button onClick={submitPost}>Submit</Button>
      </CardFooter>
    </Card>
  );
});
