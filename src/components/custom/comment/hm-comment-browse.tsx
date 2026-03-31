"use client";

import { observer } from "mobx-react-lite";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { PostDto } from "@/lib/Api";
import { Badge } from "@/components/ui/badge";
import { HiveMimeComment } from "./hm-comment";
import HexWrapper from "../utility/hm-hex-wrapper";

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
            <HexWrapper>
              <Badge className="bg-popover text-muted-foreground">
                {post.commentCount}
              </Badge>
            </HexWrapper>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HiveMimeComment comment={{ postId: post.id!, replyCount: post.commentCount }} isRoot={true} />
      </CardContent>
    </Card>
  );
});
