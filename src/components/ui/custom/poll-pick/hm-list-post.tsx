"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User } from "lucide-react"
import { Badge } from "../../badge";
import { HiveMimeListPoll } from "./hm-list-poll";
import { EmbeddedTabs, EmbeddedTabsContent, EmbeddedTabsList, EmbeddedTabsTrigger } from "../hm-embedded-tabs";
import { UpsertVoteToPostDto, UpsertVoteToPollDto, UpsertVoteToCandidateDto, ListPostDto, Api } from "@/lib/Api";
import { useContext, useEffect, useState } from "react";
import { observable } from "mobx";
import { HiveMimeApiContext } from "@/app/layout";

export interface HiveMimePostProps {
  post: ListPostDto;
}

export function HiveMimeListPost({ post }: HiveMimePostProps) {
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
    await hiveMimeService.api.pollVoteCreate(post.id!.toString(), postVote);
  }

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <span className="text-gray-500 text-sm">
                User has {post.polls?.length} question{post.polls?.length === 1 ? "" : "s"} for you
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
        <EmbeddedTabs defaultValue="Question1">
          <EmbeddedTabsList className="mt-4">
            {post.polls!.map((subPost, index) => (
              <EmbeddedTabsTrigger key={subPost.id} value={`Question${index + 1}`}>{index + 1}</EmbeddedTabsTrigger>
            ))}
          </EmbeddedTabsList>
          {post.polls!.map((poll, index) => (
            <EmbeddedTabsContent key={poll.id} value={`Question${index + 1}`}>
              <HiveMimeListPoll poll={poll} pollVote={postVote.polls![index]} />
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
