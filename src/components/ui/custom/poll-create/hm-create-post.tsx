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
    addQuestion();
  }

  function addQuestion() {
    post.polls?.push({ title: "", description: "", options: [] });
    setSelectedQuestion(`${post.polls!.length}`);
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
                <Button variant="outline" className="rounded-b-none border-b-0" onClick={addQuestion}>
                  <Plus />Add
                </Button>
            }>
              {post.polls!.map((subPoll, index) => (
                <EmbeddedTabsTrigger key={index} value={`${index + 1}`}>{index + 1}</EmbeddedTabsTrigger>
              ))}
            </EmbeddedTabsList>
            {post.polls!.map((poll, index) => (
              <EmbeddedTabsContent key={index} value={`${index + 1}`}>
                <HiveMimeCreatePoll poll={poll} />
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
