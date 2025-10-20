"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, User, ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "../../badge";
import { HiveMimeListPoll } from "./hm-list-poll";
import { EmbeddedTabs, EmbeddedTabsContent, EmbeddedTabsList, EmbeddedTabsTrigger } from "../hm-embedded-tabs";
import { UpsertVoteToPostDto, ListPostDto, Api } from "@/lib/Api";
import { useContext, useState } from "react";
import { observable } from "mobx";
import { HiveMimeApiContext } from "@/app/layout";
import { Button } from "../../button";
import { validatePickPost } from "@/lib/validate-vote";
import { toast } from "sonner";

export interface HiveMimePostProps {
  post: ListPostDto;
}

export function HiveMimeListPost({ post }: HiveMimePostProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("0");
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [postVote, setPostVote] = useState<UpsertVoteToPostDto>(() => (observable({
    postId: post.id!,
    polls: (post.polls || []).map(poll => ({
      pollId: poll.id!,
      candidates: (poll.candidates || []).map(candidate => ({
        candidateId: candidate.id!,
        value: null,
      })),
    })),
  })));

  async function submitVote()
  {
    const errors = validatePickPost(post.polls!, postVote);

    if (errors.length > 0) {
      for (const error of errors) {
        toast.error(error);
      }

      return;
    }
    
    await hiveMimeService.api.pollVoteCreate(post.id!.toString(), postVote);
  }

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
              <EmbeddedTabsTrigger key={subPost.id} value={`${index}`}>{index + 1}</EmbeddedTabsTrigger>
            ))}
          </EmbeddedTabsList>
          {post.polls!.map((poll, index) => (
            <EmbeddedTabsContent key={poll.id} value={`${index}`}>
              <HiveMimeListPoll poll={poll} pollVote={postVote.polls![index]} footer={
                <div className="flex flex-row gap-2">
                  {index > 0 && (
                    <Button className="w-full flex-1" variant="outline" onClick={() => setSelectedQuestion(`${index - 1}`)}>
                      <ArrowLeft />
                      Previous
                    </Button>
                  )}
                  {index === post.polls!.length - 1 ? (
                    <Button className="w-full flex-1 text-honey-brown" variant="outline" onClick={submitVote}
                    >
                      <Send />
                      Submit
                    </Button>
                  ) : (
                    <Button className="w-full flex-1" variant="outline" onClick={() => setSelectedQuestion(`${index + 1}`)}>
                      Next
                      <ArrowRight />
                    </Button>
                  )}
                </div>
              } />
            </EmbeddedTabsContent>
          ))}
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
}
