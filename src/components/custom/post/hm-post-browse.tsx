"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HiveDto, PaginationCursorDto, PostDto, PostOrderBy } from "@/lib/Api";
import { HiveMimePost } from "@/components/custom/post/hm-post";
import InfiniteScroll from "react-infinite-scroll-component";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import HexWrapper from "../utility/hm-hex-wrapper";
import { AnimatePresence, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { useQueryParam } from "../utility/use-query-param";
import { api } from "@/lib/contexts";


export function HiveMimePostBrowse({defaultOrderBy=PostOrderBy.Hot}: {defaultOrderBy?: PostOrderBy}) {
  const [userId, setUserId] = useQueryParam("userId");
  const [hiveId, setHiveId] = useQueryParam("hiveId");
  const [orderBy, setOrderBy] = useQueryParam("orderBy", defaultOrderBy);

  const cursor = useRef<PaginationCursorDto | undefined>(undefined);
  const [hive, setHive] = useState<HiveDto>();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [hasMore, setHasMore] = useState(true);

  function getHiveId() {
    if (!hiveId)
        return undefined;

    return Number(hiveId);
  }

  async function fetchHiveInformation() {
    const hiveId = getHiveId();

    if (!hiveId)
        return;

    const response = await api.api.hiveGetList({hiveId: hiveId!});
    setHive(response.data);
  }

  async function fetchPostsAsync(replace: boolean = false) {
    const hiveId = getHiveId();
    const userIdNumber = userId ? Number(userId) : undefined;
    const response = await api.api.postBrowseCreate({orderBy: orderBy as PostOrderBy, cursor: cursor.current, pageSize: 20}, {hiveId: hiveId, creatorId: userIdNumber});
    cursor.current = response.data.nextCursor;
    setHasMore(!!cursor.current);

    const newPostsState = replace ? response.data.items! : [...posts, ...response.data.items!];

    setPosts(newPostsState);
  }

  useEffect(() => {
    cursor.current = undefined;
    fetchHiveInformation();

    // Might want to fetch until scrollable, because InfiniteScroll does not trigger before.
    fetchPostsAsync(true);
  }, [orderBy, hiveId]);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => fetchPostsAsync(false)}
      hasMore={hasMore}
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
              {Object.values(PostOrderBy).map((order) => (
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
  );
}
