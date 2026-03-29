"use client";

import { Button } from "@/components/ui/button";
import { Api, CommentDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef, useState } from "react";
import { HiveMimeCommentCreate } from "./hm-comment-create";
import { HiveMimeRelativeTimestamp } from "../utility/hm-relative-timestamp";
import { Reply } from "lucide-react";
import { HiveMimeApiContext } from "@/lib/contexts";
import { HiveMimeExpandableText } from "../utility/hm-expandable-text";

export interface HiveMimeCommentProps {
  comment: CommentDto;
  isRoot: boolean;
}

export const HiveMimeComment = observer(({ comment, isRoot }: HiveMimeCommentProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replies, setReplies] = useState<CommentDto[]>([]);
  const [hasMoreReplies, setHasMoreReplies] = useState<boolean>(comment.replyCount! > 0);
  const [isLoadingReplies, setIsLoadingReplies] = useState<boolean>(false);

  async function loadReplies() {
    setIsLoadingReplies(true);
    const beforeDate = replies.length > 0 ? replies[replies.length - 1].createdAt : undefined;
    const response = await hiveMimeService.api.commentGetList({ postId: comment.postId!, parentCommentId: comment.id, beforeDate: beforeDate });
    setIsLoadingReplies(false);

    setReplies(prev => [...prev, ...response.data]);
    setHasMoreReplies(response.data.length > 0 && replies.length + response.data.length < comment.replyCount!);
  }

  function createFinished(newComment: CommentDto | null) {
    setIsReplying(false);

    if (newComment)
      setReplies(prev => prev ? [newComment, ...prev] : [newComment]);
  }
  
  useEffect(() => {
    if (!isRoot)
      return;

    loadReplies();
  }, []);

  return (
    <div className="flex flex-col">
      {!isRoot && <div className="flex flex-row gap-1 text-sm text-informational mb-2">
          <span className="font-bold">{comment.user?.username}</span>
          <span>•</span>
          <HiveMimeRelativeTimestamp timestamp={comment.createdAt!} />
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
                <HiveMimeComment key={reply.id} comment={reply} isRoot={false} />
            ))}
          </>
        )}
        {hasMoreReplies && (
          <Button variant="link" size="sm" onClick={loadReplies} className="self-start p-0" disabled={isLoadingReplies}>
              {isLoadingReplies ? "Loading..." : "See more comments..."}
          </Button>
        )}
      </div>
    </div>
  );
});
