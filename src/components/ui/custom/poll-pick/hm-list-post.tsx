"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, User, AlertCircleIcon, CircleCheck, CircleX, ArrowRight } from "lucide-react"
import { Badge } from "../../badge";
import { HiveMimeListPoll } from "./hm-list-poll";
import { EmbeddedTabs, EmbeddedTabsContent, EmbeddedTabsList, EmbeddedTabsTrigger } from "../hm-embedded-tabs";
import { UpsertVoteToPostDto, ListPostDto, Api } from "@/lib/Api";
import { useContext, useEffect, useState } from "react";
import { observable } from "mobx";
import { HiveMimeApiContext } from "@/app/layout";
import { Button } from "../../button";
import { validatePickPoll } from "@/lib/validate-vote";
import { toast } from "sonner";
import { getReferenceId } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { HiveMimeBulletItem } from "../hm-bullet-item";

export interface HiveMimePostProps {
  post: ListPostDto;
}

export const HiveMimeListPost = observer(({ post }: HiveMimePostProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("0");
  const [postVote, setPostVote] = useState<UpsertVoteToPostDto>(() => (observable({
    postId: post.id!,
    polls: (post.polls || []).map(poll => ({
      candidates: (poll.candidates || []).map(() => ({
        value: null,
      })),
    })),
  })));

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <span className="text-gray-500 text-sm">
                User has {post.polls?.length} poll{post.polls?.length === 1 ? "" : "s"} for you
              </span>
            </div>
            <span className="font-bold text-honey-brown">{post.title}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-muted-foreground">
          {post.description}
        </span>
        <EmbeddedTabs value={selectedQuestion} onValueChange={(value) => setSelectedQuestion(value)}>
          <EmbeddedTabsList className="mt-4">
            {post.polls!.map((subPost, index) => (
              <EmbeddedTabsTrigger key={getReferenceId(subPost)} value={`${index}`}>{index + 1}</EmbeddedTabsTrigger>
            ))}
            <EmbeddedTabsTrigger key={"overview"} value={`${post.polls!.length}`}>Overview</EmbeddedTabsTrigger>
          </EmbeddedTabsList>
          {post.polls!.map((poll, index) => (
            <EmbeddedTabsContent key={getReferenceId(poll)} value={`${index}`}>
              <HiveMimeListPoll poll={poll} pollVote={postVote.polls![index]} footer={
                <Button className="w-full flex-1 text-honey-brown" variant="outline" onClick={() => setSelectedQuestion(`${index + 1}`)}
                        disabled={validatePickPoll(poll, postVote.polls![index]).length > 0}
                >
                  Next
                  <ArrowRight />
                </Button>
              } />
            </EmbeddedTabsContent>
          ))}
          <EmbeddedTabsContent key={"overview"} value={`${post.polls!.length}`}>
            <HiveMimeVoteOverview post={post} vote={postVote} />
          </EmbeddedTabsContent>
        </EmbeddedTabs>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row gap-4">
          <Badge variant={"outline"}>
            <User  />
            128
          </Badge>
          <Badge variant={"outline"}>
            <MessageSquare height={241} />
            64
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
});

export interface HiveMimeVoteOverviewProps {
  post: ListPostDto;
  vote: UpsertVoteToPostDto;
}

export const HiveMimeVoteOverview = observer(({ post, vote }: HiveMimeVoteOverviewProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [errorMessages, setErrorMessages] = useState<string[][]>(() => post.polls!.map(() => []));
  const [isValid, setIsValid] = useState<boolean>(true);

  function validatePost()
  {
    const pollErrors: string[][] = [];

    for (let i = 0; i < post.polls!.length; i++) {
      const poll = post.polls![i];
      const pollVote = vote.polls![i];
      const errors = validatePickPoll(poll, pollVote);
      
      pollErrors.push(errors);

      if (errors.length > 0)
        setIsValid(false);
    }

    setErrorMessages(pollErrors);
  }

  async function submitVote()
  {
    await hiveMimeService.api.pollVoteCreate(post.id!.toString(), vote);
    toast.success("Your vote has been submitted.");
  }

  useEffect(() => {
    validatePost();
    console.log(errorMessages);
  }, [vote]);

  return (
    <div className="flex flex-col gap-4">
      {post.polls!.map((poll, index) => (
        <div key={getReferenceId(poll)} className="flex flex-col gap-2 p-2 border rounded-md text-muted-foreground text-sm">
          <div className="flex flex-row items-center gap-2">
            {errorMessages[index].length > 0 ?
              <CircleX className="h-4 w-4 text-red-400"/> :
              <CircleCheck className="h-4 w-4 text-green-700" />}
            <span>
              Poll {index + 1}: {poll.title}
            </span>
          </div>

          {errorMessages[index].length > 0 && (
            <HiveMimeBulletItem className="pl-1 text-red-400">
              {errorMessages[index].map((error, errIndex) => (
                <div key={errIndex}>
                  {error}
                </div>
              ))}
            </HiveMimeBulletItem>)}
        </div>
      ))}
      <Button className="w-full flex-1 text-honey-brown" variant="outline" onClick={submitVote}
                          disabled={!isValid}>
        <Send />
        Submit vote
      </Button>
    </div>
  );
});
