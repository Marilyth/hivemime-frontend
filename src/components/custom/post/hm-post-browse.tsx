"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApprovalStatus, MemberRole, PaginationCursorDto, PostOrderBy } from "@/lib/Api";
import { HiveMimePost } from "@/components/custom/post/hm-post";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArrowUpDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getReferenceId, getRoleRank } from "@/lib/utils";
import { api, followedHivesStore } from "@/lib/contexts";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { HiveMimeHiveListItem } from "../hive/list/hm-hive";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDebounce } from "../utility/debounce";
import { Card } from "@/components/ui/card";
import { observable } from "mobx";
import { useTranslation } from "react-i18next";


interface HiveMimePostBrowseProps {
  orderBy?: PostOrderBy;
  hiveId?: string;
  userId?: string;
}

export function HiveMimePostBrowse(props: HiveMimePostBrowseProps) {
  const { t } = useTranslation();
  const [orderBy, setOrderBy] = useState<PostOrderBy>(props.orderBy ?? PostOrderBy.Hot);
  const [postFilter, setPostFilter] = useState<string>("");
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>(ApprovalStatus.Approved);
  const [debouncedPostFilter, isLoading] = useDebounce(postFilter, 300);

  const currentHiveUser = props.hiveId ? followedHivesStore.followedHives.get(props.hiveId) : undefined;
  const canSeeStatusFilter = currentHiveUser != null && (getRoleRank(currentHiveUser.role!) >= getRoleRank(MemberRole.Moderator));

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
    queryKey: ['posts', props.hiveId, props.userId, orderBy, approvalStatus, debouncedPostFilter],
    queryFn: async ({ pageParam }) => {
      const response = await api.api.postBrowseCreate({
        orderBy: orderBy as PostOrderBy,
        cursor: pageParam,
        pageSize: 20,
        filter: debouncedPostFilter
      }, {
        hiveId: props.hiveId,
        creatorId: props.userId,
        approvalStatus: approvalStatus
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as PaginationCursorDto | undefined
  });

  const posts = data.data?.pages.flatMap(p => p.items!) ?? [];

  return (
    <div className="flex flex-col gap-2 mb-4">
      {hiveInformation.data && <HiveMimeHiveListItem hive={hiveInformation.data} className="mb-8" />}
      
      <Card className="p-0">
        <div className="flex flex-row gap-4 p-4 rounded-lg">
          <Input placeholder={t("posts:browse.filterByTitle")} className="flex-1" value={postFilter} onChange={(e) => setPostFilter(e.target.value)} />
          {canSeeStatusFilter && <Select onValueChange={(value) => setApprovalStatus(value as ApprovalStatus)} defaultValue={approvalStatus}>
            <SelectTrigger>
              <SelectValue placeholder={t("posts:browse.filterByApprovalStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ApprovalStatus.Approved}>{t("enums:approvalStatus.approved")}</SelectItem>
              <SelectItem value={ApprovalStatus.Pending}>{t("enums:approvalStatus.pending")}</SelectItem>
              <SelectItem value={ApprovalStatus.Rejected}>{t("enums:approvalStatus.rejected")}</SelectItem>
            </SelectContent>
          </Select>}
          <Select onValueChange={(value) => setOrderBy(value as PostOrderBy)} defaultValue={orderBy}>
            <SelectTrigger>
              <ArrowUpDown />
              <SelectValue placeholder={t("posts:browse.orderBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PostOrderBy.Hot}>{t("enums:postOrder.hot")}</SelectItem>
              <SelectItem value={PostOrderBy.New}>{t("enums:postOrder.newest")}</SelectItem>
              <SelectItem value={PostOrderBy.Old}>{t("enums:postOrder.oldest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <InfiniteScroll
        dataLength={posts.length}
        next={() => data.fetchNextPage()}
        hasMore={data.hasNextPage}
        className="overflow-visible!"
        loader=
        {
          <Skeleton className="h-64 w-full rounded-xl my-4">
            <span className="flex h-full w-full items-center justify-center text-informational">
              {t("common:loading")}
            </span>
          </Skeleton>
        }
      >
        <div className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <div key={getReferenceId(post)}>
              <HiveMimePost key={index} post={post} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
