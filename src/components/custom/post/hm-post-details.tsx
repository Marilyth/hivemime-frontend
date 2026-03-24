"use client";

import { useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Api, PostDto } from "@/lib/Api";
import { HiveMimePost } from "@/components/custom/post/hm-post";
import { HiveMimeApiContext } from "@/lib/contexts";
import { useSearchParams } from "next/navigation";

export function HiveMimePostDetails() {
  const params = useSearchParams();
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;

  const [post, setPost] = useState<PostDto | null>(null);

  function getPostId() {
    const postId = params.get("postId");

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
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183">
        {!post ? (
          <Skeleton className="h-64 w-full rounded-xl my-4">
            <span className="flex h-full w-full items-center justify-center text-gray-500">
              Loading...
            </span>
          </Skeleton>
        ) : (
          <HiveMimePost post={post} />
        )}
      </div>
    </div>
  );
}
