"use client";

import { PostDto } from "@/lib/Api";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { HiveMimePostResult } from "./result/hm-post-result";
import { HiveMimePostVote } from "./vote/hm-post-vote";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User } from "lucide-react";
import HexWrapper from "../utility/hm-hex-wrapper";
import { HiveMimeRelativeTimestamp } from "../utility/hm-relative-timestamp";
import { Button } from "@/components/ui/button";

export interface HiveMimePostProps {
  post: PostDto;
  showResults?: boolean;
}

export const HiveMimePost = observer(({ post, showResults }: HiveMimePostProps) => {
  const [resultsVisible, setResultsVisible] = useState<boolean>(showResults || false);
  const router = useRouter();

  function toggleResults() {
    setResultsVisible(prev => !prev);
  }

  function navigateToDetails() {
    router.push(`/posts/view?postId=${post.id}`);
  }

  const footer = (
  <div className="flex flex-row gap-2 cursor-pointer" onClick={navigateToDetails}>
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
        <CardTitle className="text-informational text-sm">
          <span>
            {post.hive ? <Button className="p-0 h-auto" variant="link"
              onClick={() => router.push(`/posts?hiveId=${post.hive!.id}`)}>{post.hive.name}</Button> : "Private"} • <HiveMimeRelativeTimestamp timestamp={post.createdAt!} />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!resultsVisible ?
          <HiveMimePostVote post={post} requestResults={toggleResults} footer={footer} /> :
          <HiveMimePostResult post={post} requestVote={toggleResults} footer={footer} />}
      </CardContent>
    </Card>
  );
});
