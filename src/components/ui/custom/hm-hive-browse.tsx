"use client";

import { useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Api, HiveDto } from "@/lib/Api";
import InfiniteScroll from "react-infinite-scroll-component";
import { HiveMimeHiveListItem } from "@/components/ui/custom/hive-list/hm-hive";
import { HiveMimeApiContext } from "@/lib/contexts";

export default function HiveMimeHiveBrowse() {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [hives, setHives] = useState<HiveDto[]>([]);
  const [hasMoreHives, setHasMoreHives] = useState<boolean>(true);

  async function fetchHivesAsync() {
    const lastHiveId = hives.length > 0 ? hives[hives.length - 1].id : undefined;
    const response = await hiveMimeService.api.hiveBrowseList({afterId: lastHiveId});

    const newHivesState = [...hives, ...response.data];
    setHives(newHivesState);

    setHasMoreHives(response.data.length == 20 && newHivesState.length < 100);
  }

  useEffect(() => {
    // Might want to fetch until scrollable, because InfiniteScroll does not trigger before.
    fetchHivesAsync();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <InfiniteScroll
          dataLength={hives.length}
          next={fetchHivesAsync}
          hasMore={hasMoreHives}
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
            <div className="my-4 text-center">There are no more hives! Consider creating your own.</div>
          }
        >
          <div className="flex justify-center flex-row flex-wrap gap-4">
            {hives.map((hive, index) => (
              <HiveMimeHiveListItem key={index} hive={hive} className="w-96 min-h-56" />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
