"use client";

import { useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Api, PostDto } from "@/lib/Api";
import { HiveMimePost } from "@/components/custom/post/hm-post";
import { HiveMimeApiContext } from "@/lib/contexts";
import { HiveMimeCommentBrowse } from "../comment/hm-comment-browse";
import { useQueryParam } from "../utility/use-query-param";

export function HiveMimePostDetails() {
  const [postId, setPostId] = useQueryParam("postId");
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;

  const [post, setPost] = useState<PostDto | null>(null);

  function getPostId() {
    if (!postId)
      throw new Error("postId is required");

    return Number(postId);
  }

  async function fetchPostAsync() {
    const postId = getPostId();
    const response = await hiveMimeService.api.postGetList({postId: postId});

    setPost(response.data);
  }

  useEffect(() => {
    fetchPostAsync();
  }, [postId]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183">
        {!post ? (
          <Skeleton className="h-64 w-full rounded-xl my-4">
            <span className="flex h-full w-full items-center justify-center text-informational">
              Loading...
            </span>
          </Skeleton>
        ) : (
          <div className="flex flex-col gap-6">
            <HiveMimePost post={post} />
            <HiveMimeCommentBrowse post={post} />
          </div>
        )}
      </div>
    </div>
  );
}
