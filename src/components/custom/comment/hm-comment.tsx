"use client";

import { Button } from "@/components/ui/button";
import { CommentDto, CommentOrderBy, MemberRole, PaginationCursorDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { HiveMimeCommentCreate } from "./hm-comment-create";
import { HiveMimeRelativeTimestamp } from "../utility/hm-relative-timestamp";
import { CircleMinus, CirclePlus, Ellipsis, Gavel, Reply, Trash2 } from "lucide-react";
import { HiveMimeExpandableText } from "../utility/hm-expandable-text";
import { AsyncButton } from "../utility/async-button";
import { toast } from "sonner";
import { api, followedHivesStore, userStore } from "@/lib/contexts";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getEffectiveRole, getRoleColor, getRoleRank } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

export interface HiveMimeCommentProps {
  hiveId?: string;
  comment: CommentDto;
  prefetchedReplies?: CommentDto[];
  isRoot: boolean;
  parentComment?: CommentDto;
  textFilter?: string;
  orderBy?: CommentOrderBy;
}

export const HiveMimeComment = observer(({ hiveId, comment, isRoot, prefetchedReplies, parentComment, textFilter, orderBy }: HiveMimeCommentProps) => {
  const { t } = useTranslation();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [loadedParentComment, setLoadedParentComment] = useState<CommentDto | null>(null);
  const [createdReplies, setCreatedReplies] = useState<CommentDto[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const currentHiveUser = hiveId ? followedHivesStore.followedHives.get(hiveId) : undefined;
  const currentUserRoleRank = getRoleRank(getEffectiveRole(currentHiveUser?.role, currentHiveUser?.approvalStatus));
  const commentUserRoleRank = getRoleRank(comment.role ?? MemberRole.Follower);

  const canDelete = !isRoot &&
    (comment.user?.id == userStore.user?.id ||
      (currentHiveUser != null && currentUserRoleRank >= getRoleRank(MemberRole.Moderator)));

  const canBan = !isRoot &&
    comment.user?.id != userStore.user?.id &&
    (currentHiveUser != null && currentUserRoleRank >= getRoleRank(MemberRole.Moderator) && commentUserRoleRank < currentUserRoleRank);

  const repliesQuery = useInfiniteQuery({
    queryKey: ['commentReplies', comment.id, textFilter, orderBy],
    queryFn: async ({ pageParam }) => {
      const task = api.api.commentBrowseCreate({
        pageSize: 20,
        cursor: pageParam,
        filter: textFilter,
        orderBy: orderBy
      }, {
        postId: comment.postId!,
        parentCommentId: comment.id,
        onlyRoot: !textFilter
      });
      toast.promise(task, {
        loading: t("toasts:comment.loading")
      });

      const response = await task;
      return response.data;
    },
    enabled: isRoot,
    initialPageParam: undefined as PaginationCursorDto | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  const replies: CommentDto[] = [...
    new Map(
      [
        ...(createdReplies ?? []),
        ...(prefetchedReplies ?? []).filter(c => c.parentCommentId === comment.id),
        ...(repliesQuery.data?.pages.flatMap(p => p.items) ?? []),
      ].map(item => [item?.id, item])
    ).values()
  ] as CommentDto[];

  async function loadParentComment() {
    if (!comment.parentCommentId)
      return;

    const task = api.api.commentGetList({ commentId: comment.parentCommentId });
    toast.promise(task, {
      loading: t("toasts:comment.loadingParent")
    });
    const response = await task;

    setLoadedParentComment(response.data);
  }

  function createFinished(newComment: CommentDto | null) {
    setIsReplying(false);

    if (newComment){
      setCreatedReplies(prev => prev ? [newComment, ...prev] : [newComment]);
    }
  }

  function getNextPrefetchedReplies() {
    return [comment,
            ...replies,
            ...(prefetchedReplies ?? []).filter(c => c.parentCommentId != comment.id && !replies.some(r => r.id === c.id))];
  }

  function hasMoreReplies() {
    if (!repliesQuery.data || repliesQuery.data.pages.length === 0)
      return replies.length < comment.replyCount! + createdReplies.length;

    return repliesQuery.hasNextPage;
  }

  async function deleteComment() {
    const task = api.api.commentDeleteDelete({ commentId: comment.id! });

    toast.promise(task, {
      loading: t("toasts:comment.deleting"),
      success: t("toasts:comment.deleted"),
    });

    await task;
  }

  async function banUser() {
    const task = api.api.hiveBanUserPartialUpdate({
      hiveId: hiveId,
      userId: comment.user!.id
    });

    toast.promise(task, {
      loading: t("toasts:ban.banningUser"),
      success: t("toasts:ban.userBanned"),
    });

    await task;
  }

  return (
    <div className="flex flex-col">
      {comment.parentCommentId && !parentComment?.id && (
        !loadedParentComment ? (
        <AsyncButton variant="link" size="sm" onClick={loadParentComment} className="self-start p-0 h-auto mb-2">
            {t("comments:item.loadParentComment")}
        </AsyncButton>
        ) : (
          <HiveMimeComment hiveId={hiveId} comment={loadedParentComment} isRoot={false} prefetchedReplies={getNextPrefetchedReplies()} />
        )
      )}

      {!loadedParentComment && (
        <div className="flex flex-row gap-1 mb-2">
          {!isRoot && (
            <div className="flex flex-col items-center text-muted-foreground">
              <Button variant="ghost" size="sm" className="p-0! h-auto" onClick={() => setIsCollapsed(prev => !prev)}>
                {isCollapsed ? <CirclePlus /> : <CircleMinus />}
              </Button>
              {!isCollapsed && <div className="border-l flex-1">
              </div>}
            </div>
          )}
          <div className="flex flex-col w-full">
            {!isRoot &&
              <div className="flex flex-row gap-1 text-sm text-informational mb-2">
                <Link href={`/user?id=${comment.user?.id}`} className="font-bold">
                  {comment.user?.username}
                </Link>
                {comment.isOriginalPoster &&
                  <Tooltip>
                    <TooltipTrigger className="text-sm">
                       <Badge variant="outline" className="text-xs text-honey-brown p-0 px-1">
                        {t("comments:item.opBadge")}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("comments:item.postCreatorTooltip")}
                    </TooltipContent>
                  </Tooltip>
                }
                {getRoleRank(comment.role!) > getRoleRank(MemberRole.Follower) && (
                  <Tooltip>
                    <TooltipTrigger className="text-sm">
                       <Badge variant="outline" className={`text-xs p-0 px-1 ${getRoleColor(comment.role!)}`}>
                        {t(`enums:memberRole.${comment.role!.toLowerCase()}`)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("comments:item.hiveRoleTooltip", { role: t(`enums:memberRole.${comment.role!.toLowerCase()}`) })}
                    </TooltipContent>
                  </Tooltip>
                )}
                • <HiveMimeRelativeTimestamp timestamp={comment.createdAt!} />
                {(canDelete || canBan) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-auto" asChild>
                      <Button variant="ghost" className="h-auto p-0">
                        <Ellipsis />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {canDelete && <DropdownMenuItem onSelect={deleteComment}><Trash2 /> {t("comments:item.delete")}</DropdownMenuItem>}
                    {canBan && <DropdownMenuItem onSelect={banUser}><Gavel className="text-red-400" /> {t("comments:item.banUser")}</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>)}
              </div>
            }

            <AnimatePresence>
              {!isCollapsed && <motion.div className="flex flex-col gap-1" 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                  {!isRoot &&
                    <>
                      <HiveMimeExpandableText lines={3} className="[overflow-wrap:anywhere]">
                        {comment.content} 
                      </HiveMimeExpandableText>
                      <div className="flex flex-row gap-2 items-center text-sm text-muted-foreground">
                          <Button variant="ghost" size="sm" onClick={() => setIsReplying(true)} className="p-1!">
                              <Reply className="mr-1" />
                              {t("comments:item.reply")}
                          </Button>
                      </div>
                    </>
                  }
                  {(isReplying || isRoot) &&
                    (<HiveMimeCommentCreate
                      postId={comment.postId!}
                      parentCommentId={comment.id}
                      onFinished={createFinished}
                      autoFocus={isReplying}
                    />)
                  }
                  
                  <InfiniteScroll
                    dataLength={replies.length}
                    next={() => repliesQuery.fetchNextPage()}
                    hasMore={isRoot && hasMoreReplies()}
                    loader={<p>{t("common:loading")}</p>}
                  >
                    {replies.map(reply => (
                        <HiveMimeComment key={reply.id} hiveId={hiveId} comment={reply} isRoot={false} prefetchedReplies={prefetchedReplies} parentComment={comment} />
                    ))}
                  </InfiniteScroll>

                  {hasMoreReplies() && (
                    <AsyncButton variant="link" size="sm" onClick={() => repliesQuery.fetchNextPage()} className="self-start p-0 pb-1 h-auto">
                        {t("comments:item.loadReplies")}
                    </AsyncButton>
                  )}
              </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
});
