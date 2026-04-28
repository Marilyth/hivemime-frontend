"use client";

import { Button } from "@/components/ui/button";
import { CommentDto, PaginationCursorDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { HiveMimeCommentCreate } from "./hm-comment-create";
import { HiveMimeRelativeTimestamp } from "../utility/hm-relative-timestamp";
import { Reply } from "lucide-react";
import { HiveMimeExpandableText } from "../utility/hm-expandable-text";
import { AsyncButton } from "../utility/async-button";
import { toast } from "sonner";
import { api } from "@/lib/contexts";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

export interface HiveMimeCommentProps {
  comment: CommentDto;
  prefetchedReplies?: CommentDto[];
  isRoot: boolean;
  allowLoadParent?: boolean;
}

export const HiveMimeComment = observer(({ comment, isRoot, prefetchedReplies, allowLoadParent = false }: HiveMimeCommentProps) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [parentComment, setParentComment] = useState<CommentDto | null>(null);
  const [createdReplies, setCreatedReplies] = useState<CommentDto[]>([]);

  const repliesQuery = useInfiniteQuery({
    queryKey: ['commentReplies', comment.id],
    queryFn: async ({ pageParam }) => {
      const task = api.api.commentBrowseCreate({pageSize: 20, cursor: pageParam}, { postId: comment.postId!, parentCommentId: comment.id });
      toast.promise(task, {
        loading: 'Loading comments...',
        success: 'Comments loaded.'
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
      loading: 'Loading parent comment...',
      success: 'Parent comment loaded.'
    });
    const response = await task;

    setParentComment(response.data);
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

  return (
    <div className="flex flex-col">
      {comment.parentCommentId && allowLoadParent && (
        !parentComment ? (
        <AsyncButton variant="link" size="sm" onClick={loadParentComment} className="self-start p-0 h-auto mb-2">
            Load parent comment...
        </AsyncButton>
        ) : (
          <HiveMimeComment comment={parentComment} isRoot={false} allowLoadParent={true} prefetchedReplies={getNextPrefetchedReplies()} />
        )
      )}

      {!parentComment && (
        <>
        {!isRoot && <div className="flex flex-row gap-1 text-sm text-informational mb-2">
          <Link href={`/user?id=${comment.user?.id}`} className="font-bold">{comment.user?.username}</Link> • <HiveMimeRelativeTimestamp timestamp={comment.createdAt!} />
          </div>}
        
          <div className={`flex flex-col gap-1 ${isRoot ? "" : "border-l pl-4"}`}>
            {!isRoot &&
              <>
                <HiveMimeExpandableText lines={3} className="[overflow-wrap:anywhere]">
                  {comment.content} 
                </HiveMimeExpandableText>
                <div className="flex flex-row gap-2 items-center text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm" onClick={() => setIsReplying(true)} className="p-1!">
                        <Reply className="mr-1" />
                        Reply
                    </Button>
                </div>
              </>
            }
            {(isReplying || isRoot) &&
                (<HiveMimeCommentCreate
                    postId={comment.postId!}
                    parentCommentId={comment.id}
                    onFinished={createFinished}
                />)
            }
            
            <InfiniteScroll
              dataLength={replies.length}
              next={() => repliesQuery.fetchNextPage()}
              hasMore={isRoot && hasMoreReplies()}
              loader={<p>Loading...</p>}
            >
              {replies.map(reply => (
                  <HiveMimeComment key={reply.id} comment={reply} isRoot={false} prefetchedReplies={prefetchedReplies} />
              ))}
            </InfiniteScroll>

            {hasMoreReplies() && (
              <AsyncButton variant="link" size="sm" onClick={() => repliesQuery.fetchNextPage()} className="self-start p-0 pb-1 h-auto">
                  Load replies...
              </AsyncButton>
            )}
          </div>
        </>
      )}
    </div>
  );
});
