"use client";

import { HiveMimePost } from "@/components/ui/hm-post";
import { useContext, useEffect, useState } from "react";
import { HiveMimeServiceContext } from "../layout";
import { HiveMimeService } from "@/lib/hivemime-service";
import { Post } from "@/models/post";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const hiveMimeService: HiveMimeService = useContext(HiveMimeServiceContext)!;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);

  async function fetchPostsAsync() {
    setIsLoadingPosts(true);
    setPosts(await hiveMimeService.browsePostsAsync());
    setIsLoadingPosts(false);
  }

  useEffect(() => {
    fetchPostsAsync();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183 flex flex-col gap-4">
        {posts.map((post, index) => (
          <HiveMimePost key={index} post={post} />
        ))}

        {isLoadingPosts && (
          <div>
            <Skeleton className="h-64 w-full rounded-xl">
              <span className="flex h-full w-full items-center justify-center text-gray-500">
                Loading...
              </span>
            </Skeleton>
          </div>
        )}
      </div>
    </div>
  );
}
