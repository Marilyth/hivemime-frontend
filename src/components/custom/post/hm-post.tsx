"use client";

import { PostDto } from "@/lib/Api";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { HiveMimePostResult } from "./result/hm-post-result";
import { HiveMimePostVote } from "./vote/hm-post-vote";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User } from "lucide-react";
import HexWrapper from "../utility/hm-hex-wrapper";
import { HiveMimeRelativeTimestamp } from "../utility/hm-relative-timestamp";

export interface HiveMimePostProps {
  post: PostDto;
  showResults?: boolean;
}

export const HiveMimePost = observer(({ post, showResults }: HiveMimePostProps) => {
  const [resultsVisible, setResultsVisible] = useState<boolean>(showResults || false);

  function toggleResults() {
    setResultsVisible(prev => !prev);
  }

  function navigateToDetails() {
    redirect(`/posts/view?postId=${post.id}`);
  }

  const footer = (
  <div className="flex flex-row gap-2 w-full">
    <HexWrapper className="self-end">
      <Badge className="h-6 bg-popover text-muted-foreground">
        <User  />
        {post.voteCount}
      </Badge>
    </HexWrapper>
    <HexWrapper className="self-end">
      <Badge className="h-6 bg-popover text-muted-foreground">
        <MessageSquare />
        {post.commentCount}
      </Badge>
    </HexWrapper>
  </div>);

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle onClick={navigateToDetails} className="cursor-pointer">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <span className="text-informational text-sm">
                {post.creator?.username} • <HiveMimeRelativeTimestamp timestamp={post.createdAt!} />
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
        {!resultsVisible ?
          <HiveMimePostVote post={post} requestResults={toggleResults} footer={footer} /> :
          <HiveMimePostResult post={post} requestVote={toggleResults} footer={footer} />}
      </CardContent>
    </Card>
  );
});
