"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HTMLAttributes, useState } from "react";
import { AsyncButton } from "../utility/async-button";
import { toast } from "sonner";
import { api } from "@/lib/contexts";
import { useTranslation } from "react-i18next";

export type HiveMimeCommentCreateProps = HTMLAttributes<HTMLDivElement> & {
  postId: number;
  parentCommentId?: number;
  onFinished?: (comment: CommentDto | null) => void;
};

export const HiveMimeCommentCreate = observer(({ postId, parentCommentId, onFinished, className, ...props }: HiveMimeCommentCreateProps) => {
  const { t } = useTranslation();
  const [content, setContent] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  async function createComment() {
    const task = api.api.commentCreateCreate({ postId, parentCommentId, content });
    toast.promise(task, {
      loading: t("toasts:comment.creating"),
      success: t("toasts:comment.created")
    });

    const response = await task;
    
    if (onFinished)
      onFinished(response.data.dto!);

    setContent("");
  }

  return (
    <div className={`flex flex-col ${className}`} {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.currentTarget.contains(e.relatedTarget as Node))} >
        <Textarea autoFocus={props.autoFocus} placeholder={t("comments:create.placeholder")} value={content} onChange={(e) => setContent(e.target.value)} className="mb-2" />
            {isFocused && <div className="flex flex-row gap-2 mb-4">
            <Button variant="outline" onClick={() => onFinished ? onFinished(null) : setContent("")}>
                {t("common:cancel")}
            </Button>
            <AsyncButton onClick={createComment} disabled={content.trim().length === 0}>
                {t("comments:create.post")}
            </AsyncButton>
        </div>}
    </div>
  );
});
