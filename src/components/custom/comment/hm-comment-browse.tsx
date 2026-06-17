"use client";

import { observer } from "mobx-react-lite";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { CommentOrderBy, PostDto } from "@/lib/Api";
import { HiveMimeComment } from "./hm-comment";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, LucideMessagesSquare } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "../utility/debounce";
import { useTranslation } from "react-i18next";

export interface HiveMimeCommentBrowseProps {
  post: PostDto;
}

export const HiveMimeCommentBrowse = observer(({ post }: HiveMimeCommentBrowseProps) => {
  const { t } = useTranslation();
  const [textFilter, setTextFilter] = useState<string>("");
  const [debouncedTextFilter, isLoading] = useDebounce(textFilter, 1000);
  const [orderBy, setOrderBy] = useState<CommentOrderBy>(CommentOrderBy.New);

  return (
    <Card className="pb-0">
      <CardHeader className="border-b gap-4">
        <CardTitle>
          <div className="flex flex-row gap-2 items-center">
            <LucideMessagesSquare className="h-4 w-4 text-muted-foreground" /> {t("comments:browse.title")}
          </div>
        </CardTitle>
        <div className="flex flex-row gap-4 rounded-lg">
          <Input placeholder={t("comments:browse.filterByText")} className="flex-1" value={textFilter} onChange={(e) => setTextFilter(e.target.value)} />
          <Select onValueChange={(value) => setOrderBy(value as CommentOrderBy)} defaultValue={orderBy}>
            <SelectTrigger>
              <ArrowUpDown />
              <SelectValue placeholder={t("comments:browse.orderBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CommentOrderBy.Best}>{t("enums:commentOrder.best")}</SelectItem>
              <SelectItem value={CommentOrderBy.New}>{t("enums:commentOrder.newest")}</SelectItem>
              <SelectItem value={CommentOrderBy.Old}>{t("enums:commentOrder.oldest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <HiveMimeComment comment={{ postId: post.id!, replyCount: post.commentCount }} isRoot={true} hiveId={post.hive?.id}
          textFilter={debouncedTextFilter} orderBy={orderBy} />
      </CardContent>
    </Card>
  );
});
