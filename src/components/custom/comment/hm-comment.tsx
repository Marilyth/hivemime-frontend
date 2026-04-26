"use client";

import { Button } from "@/components/ui/button";
import { CommentDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { HiveMimeCommentCreate } from "./hm-comment-create";
import { HiveMimeRelativeTimestamp } from "../utility/hm-relative-timestamp";
import { Reply } from "lucide-react";
import { HiveMimeExpandableText } from "../utility/hm-expandable-text";
import { AsyncButton } from "../utility/async-button";
import { toast } from "sonner";
import { api } from "@/lib/contexts";
import Link from "next/link";

export interface HiveMimeCommentProps {
  comment: CommentDto;
  prefetchedReplies?: CommentDto[];
  isRoot: boolean;
  allowLoadParent?: boolean;
}

export const HiveMimeComment = observer(({ comment, isRoot, prefetchedReplies, allowLoadParent = false }: HiveMimeCommentProps) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const repliesCount = useRef<number>(comment.replyCount || 0);
  const [replies, setReplies] = useState<CommentDto[]>(prefetchedReplies?.filter(r => r.parentCommentId == comment.id) || []);
  const [hasMoreReplies, setHasMoreReplies] = useState<boolean>(false);
  const [parentComment, setParentComment] = useState<CommentDto | null>(null);
  const cursor = useRef<CommentDto | undefined>(undefined);
  
  function mergePreLoadedReplies() {
    const arr = [...(prefetchedReplies || []), ...replies, comment];

    const distinct = arr.filter(
      (item, index, self) =>
        index === self.findIndex(i => i.id === item.id)
    );
    
    return distinct;
  }

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

  async function loadReplies() {
    const task = api.api.commentBrowseCreate({pageSize: 20, cursor: cursor.current?.id}, { postId: comment.postId!, parentCommentId: comment.id });
    toast.promise(task, {
      loading: 'Loading comments...',
      success: 'Comments loaded.'
    });
    const response = await task;

    setReplies(prev => [...prev, ...response.data.filter(r => !prev.some(pr => pr.id === r.id))]);
    cursor.current = response.data.length > 0 ? response.data[response.data.length - 1] : cursor.current;
  }

  function createFinished(newComment: CommentDto | null) {
    setIsReplying(false);

    if (newComment){
      repliesCount.current += 1;
      setReplies(prev => prev ? [newComment, ...prev] : [newComment]);
    }
  }
  
  useEffect(() => {
    if (!isRoot)
      return;

    loadReplies();
  }, []);

  useEffect(() => {
    setHasMoreReplies(repliesCount.current > 0 && replies.length < repliesCount.current);
  }, [replies.length]);

  return (
    <div className="flex flex-col">
      {comment.parentCommentId && allowLoadParent && (
        !parentComment ? (
        <AsyncButton variant="link" size="sm" onClick={loadParentComment} className="self-start p-0 h-auto mb-2">
            Load parent comment...
        </AsyncButton>
        ) : (
          <HiveMimeComment comment={parentComment} isRoot={false} allowLoadParent={true} prefetchedReplies={mergePreLoadedReplies()} />
        )
      )}

      {!parentComment && (
        <>
        {!isRoot && <div className="flex flex-row gap-1 text-sm text-informational mb-2">
          <Link href={`/user?id=${comment.user?.id}`} className="font-bold">{comment.user?.username}</Link> • <HiveMimeRelativeTimestamp timestamp={comment.createdAt!} />
          </div>}
        
          <div className={`flex flex-col gap-2 ${isRoot ? "" : "border-l pl-4"}`}>
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
            {replies.length > 0 && (
              <>
                {replies.map(reply => (
                    <HiveMimeComment key={reply.id} comment={reply} isRoot={false} prefetchedReplies={prefetchedReplies} />
                ))}
              </>
            )}
            {hasMoreReplies && (
              <AsyncButton variant="link" size="sm" onClick={loadReplies} className="self-start p-0 h-auto">
                  See more comments...
              </AsyncButton>
            )}
          </div>
        </>
      )}
    </div>
  );
});
