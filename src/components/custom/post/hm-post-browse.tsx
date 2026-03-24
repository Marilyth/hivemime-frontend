"use client";

import { useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Api, HiveDto, PostDto } from "@/lib/Api";
import { HiveMimePost } from "@/components/custom/post/hm-post";
import InfiniteScroll from "react-infinite-scroll-component";
import { HiveMimeApiContext } from "@/lib/contexts";
import { useRouter, useSearchParams } from "next/navigation";

export function HiveMimePostBrowse() {
  const router = useRouter();
  const params = useSearchParams();
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;

  const [hive, setHive] = useState<HiveDto>();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);

  function getAfterId() {
    const afterId = params.get("afterId");

    if (!afterId)
      return undefined;

    return Number(afterId);
  }

  function getHiveId() {
    const hiveId = params.get("hiveId");

    if (!hiveId)
        return undefined;

    return Number(hiveId);
  }

  async function fetchHiveInformation() {
    const hiveId = getHiveId();

    if (!hiveId)
        return;

    const response = await hiveMimeService.api.hiveGetList({hiveId: hiveId!});
    setHive(response.data);
  }

  async function fetchPostsAsync() {
    const lastPostId = posts.length > 0 ? posts[posts.length - 1].id : getAfterId();

    // Update afterId in URL to keep state on refresh.
    if (lastPostId) {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("afterId", lastPostId.toString());
        router.replace("?" + newParams.toString());
    }

    const hiveId = getHiveId();
    const response = await hiveMimeService.api.postBrowseList({afterId: lastPostId, hiveId: hiveId});

    const newPostsState = [...posts, ...response.data];

    setPosts(newPostsState);
    setHasMorePosts(response.data.length == 20 && newPostsState.length < 100);
  }

  useEffect(() => {
    fetchHiveInformation();

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
            <div className="my-4 text-center">You reached the end of your feed!</div>
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
