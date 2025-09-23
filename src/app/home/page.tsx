"use client";

import { HiveMimeListPost } from "@/components/ui/hm-list-post";
import { useContext, useEffect, useState } from "react";
import { HiveMimeApiContext } from "../layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Api, ListPostDto } from "@/lib/Api";

export default function Page() {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [posts, setPosts] = useState<ListPostDto[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);

  async function fetchPostsAsync() {
    setIsLoadingPosts(true);
    setPosts((await hiveMimeService.api.postBrowseList()).data);
    setIsLoadingPosts(false);
  }

  useEffect(() => {
    fetchPostsAsync();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183 flex flex-col gap-4">
        {posts.map((post, index) => (
          <HiveMimeListPost key={index} post={post} />
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
