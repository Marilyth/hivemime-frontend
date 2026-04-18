"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Api, HiveDto, OrderBy, PostDto } from "@/lib/Api";
import { HiveMimePost } from "@/components/custom/post/hm-post";
import InfiniteScroll from "react-infinite-scroll-component";
import { HiveMimeApiContext } from "@/lib/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import HexWrapper from "../utility/hm-hex-wrapper";
import { AnimatePresence, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";

export function HiveMimePostBrowse() {
  const router = useRouter();
  const params = useSearchParams();
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;

  const cursor = useRef<number | null>(null);
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.Hot);
  const [hive, setHive] = useState<HiveDto>();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);

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

  async function fetchPostsAsync(replace: boolean = false) {
    const hiveId = getHiveId();
    const response = await hiveMimeService.api.postBrowseCreate({orderBy: orderBy, cursor: cursor.current, pageSize: 20}, {hiveId: hiveId});
    cursor.current = response.data.length > 0 ? response.data[response.data.length - 1].id! : cursor.current;

    const newPostsState = replace ? response.data : [...posts, ...response.data];

    setPosts(newPostsState);
    setHasMorePosts(response.data.length == 20 && newPostsState.length < 100);
  }

  useEffect(() => {
    cursor.current = null;
    fetchHiveInformation();

    // Might want to fetch until scrollable, because InfiniteScroll does not trigger before.
    fetchPostsAsync(true);
  }, [orderBy]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183">
        <InfiniteScroll
          dataLength={posts.length}
          next={() => fetchPostsAsync(false)}
          hasMore={hasMorePosts}
          loader=
          {
            <Skeleton className="h-64 w-full rounded-xl my-4">
              <span className="flex h-full w-full items-center justify-center text-informational">
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
            <HexWrapper className="mr-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className="bg-card">
                    <ArrowUpDown />
                    {orderBy}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.values(OrderBy).map((order) => (
                    <DropdownMenuItem key={order} onSelect={() => setOrderBy(order)}>
                      {order}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </HexWrapper>

            {posts.length > 0 &&
              <AnimatePresence initial={false} mode="popLayout">
                {posts.map((post, index) => (
                  <motion.div
                    key={getReferenceId(post)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3 } }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HiveMimePost key={index} post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            }
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
