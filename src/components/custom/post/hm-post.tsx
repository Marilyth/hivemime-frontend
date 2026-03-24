"use client";

import { PostDto } from "@/lib/Api";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { HiveMimePostResult } from "./post-result/hm-post-result";
import { HiveMimePostVote } from "./post-vote/hm-post-vote";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

export interface HiveMimePostProps {
  post: PostDto;
  showResults?: boolean;
}

export const HiveMimePost = observer(({ post, showResults }: HiveMimePostProps) => {
  const [resultsVisible, setResultsVisible] = useState<boolean>(showResults || false);

  function toggleResults() {
    setResultsVisible(prev => !prev);
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
        {!resultsVisible ?
          <HiveMimePostVote post={post} requestResults={toggleResults} /> :
          <HiveMimePostResult post={post} requestVote={toggleResults} />}
      </CardContent>
    </Card>
  );
});
