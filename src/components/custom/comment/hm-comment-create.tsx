"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Api, CommentDto } from "@/lib/Api";
import { HiveMimeApiContext } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { HTMLAttributes, useContext, useState } from "react";
import { AsyncButton } from "../utility/async-button";
import { toast } from "sonner";

export type HiveMimeCommentCreateProps = HTMLAttributes<HTMLDivElement> & {
  postId: number;
  parentCommentId?: number;
  onFinished?: (comment: CommentDto | null) => void;
};

export const HiveMimeCommentCreate = observer(({ postId, parentCommentId, onFinished, className, ...props }: HiveMimeCommentCreateProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [content, setContent] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  async function createComment() {
    const task = hiveMimeService.api.commentCreateCreate({ postId, parentCommentId, content });
    toast.promise(task, {
      loading: 'Creating comment...',
      success: 'Comment created successfully!'
    });

    const response = await task;
    
    if (onFinished)
      onFinished(response.data);

    setContent("");
  }

  return (
    <div className={`flex flex-col ${className}`} {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.currentTarget.contains(e.relatedTarget as Node))} >
        <Textarea placeholder="Write your comment here..." value={content} onChange={(e) => setContent(e.target.value)} className="mb-2" />
            {isFocused && <div className="flex flex-row gap-2 mb-4">
            <Button variant="outline" onClick={() => onFinished ? onFinished(null) : setContent("")}>
                Cancel
            </Button>
            <AsyncButton onClick={createComment} disabled={content.trim().length === 0}>
                Post
            </AsyncButton>
        </div>}
    </div>
  );
});
