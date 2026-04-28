"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PaginationCursorDto } from "@/lib/Api";
import InfiniteScroll from "react-infinite-scroll-component";
import { HiveMimeHiveListItem } from "./list/hm-hive";
import { api } from "@/lib/contexts";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function HiveMimeHiveBrowse() {
  const data = useInfiniteQuery({
    queryKey: ['hives'],
    queryFn: async ({ pageParam }) => {
      const response = await api.api.hiveBrowseCreate({cursor: pageParam, pageSize: 20});
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as PaginationCursorDto | undefined
  });

  const hives = data.data?.pages.flatMap(p => p.items!) ?? [];

  return (
    <InfiniteScroll
      dataLength={hives.length}
      next={data.fetchNextPage}
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
        <div className="my-4 text-center">There are no more hives! Consider creating your own.</div>
      }
    >
      <div className="flex justify-center flex-row flex-wrap gap-4">
        {hives.map((hive, index) => (
          <HiveMimeHiveListItem key={index} hive={hive} className="w-96 min-h-56" />
        ))}
      </div>
    </InfiniteScroll>
  );
}
