"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { HiveMimeApiContext } from "../layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Api, PostDto } from "@/lib/Api";
import { HiveMimePost } from "@/components/ui/custom/poll-pick/hm-list-post";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Page() {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);

  async function fetchPostsAsync() {
    const lastPostId = posts.length > 0 ? posts[posts.length - 1].id : undefined;
    const response = await hiveMimeService.api.postBrowseList({afterId: lastPostId});

    const newPostsState = [...posts, ...response.data];
    setPosts(newPostsState);

    setHasMorePosts(response.data.length == 20 && newPostsState.length < 100);
  }

  useEffect(() => {
    // Might want to fetch until scrollable, because InfiniteScroll does not trigger before.
    fetchPostsAsync();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183">
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPostsAsync}
          hasMore={hasMorePosts}
          loader=
          {
            <Skeleton className="h-64 w-full rounded-xl my-4">
              <span className="flex h-full w-full items-center justify-center text-gray-500">
                Loading...
              </span>
            </Skeleton>
          }
          endMessage=
          {
            <div className="my-4 text-center">You have reached the end of your feed!</div>
          }
        >
          <div className="flex flex-col gap-4">
            {posts.map((post, index) => (
              <HiveMimePost key={index} post={post} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
