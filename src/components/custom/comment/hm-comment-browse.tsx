"use client";

import { observer } from "mobx-react-lite";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { PostDto } from "@/lib/Api";
import { Badge } from "@/components/ui/badge";
import { HiveMimeComment } from "./hm-comment";

export interface HiveMimeCommentBrowseProps {
  post: PostDto;
}

export const HiveMimeCommentBrowse = observer(({ post }: HiveMimeCommentBrowseProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row gap-2 items-center">
            Comments
            <Badge variant="outline">{post.commentCount}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HiveMimeComment comment={{ postId: post.id!, replyCount: post.commentCount }} isRoot={true} />
      </CardContent>
    </Card>
  );
});
