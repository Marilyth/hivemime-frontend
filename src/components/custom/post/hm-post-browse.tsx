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
import { api } from "@/lib/contexts";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";


interface HiveMimePostBrowseProps {
  orderBy?: PostOrderBy;
  hiveId?: number;
  userId?: number;
}

export function HiveMimePostBrowse(props: HiveMimePostBrowseProps) {
  const [orderBy, setOrderBy] = useState<PostOrderBy>(props.orderBy ?? PostOrderBy.Hot);

  const hiveInformation = useQuery({
    queryKey: ['hiveInformation', props.hiveId],
    queryFn: async () => {
      if (!props.hiveId)
        return undefined;

      const response = await api.api.hiveGetList({ hiveId: props.hiveId });
      return response.data;
    },
    enabled: !!props.hiveId
  });

  const data = useInfiniteQuery({
    queryKey: ['posts', props.hiveId, props.userId, orderBy],
    queryFn: async ({ pageParam }) => {
      const response = await api.api.postBrowseCreate({orderBy: orderBy as PostOrderBy, cursor: pageParam, pageSize: 20}, {hiveId: props.hiveId, creatorId: props.userId});
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as PaginationCursorDto | undefined
  });

  const posts = data.data?.pages.flatMap(p => p.items!) ?? [];

  return (
    <div className="flex flex-col gap-2 mb-4">
      {hiveInformation.data?.name && <h2 className="text-2xl font-bold">{hiveInformation.data.name}</h2>}
      
      <div>
        <HexWrapper>
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
      </div>

      <InfiniteScroll
        dataLength={posts.length}
        next={() => data.fetchNextPage()}
        hasMore={data.hasNextPage}
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
        </div>
      </InfiniteScroll>
    </div>
  );
}
