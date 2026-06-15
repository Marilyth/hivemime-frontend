"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { HiveMimePost } from "@/components/custom/post/hm-post";
import { HiveMimeCommentBrowse } from "../comment/hm-comment-browse";
import { useQueryParam } from "../utility/use-query-param";
import { api } from "@/lib/contexts";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { observable } from "mobx";

export function HiveMimePostDetails() {
  const { t } = useTranslation();
  const [postId, setPostId] = useQueryParam("postId");

  function getPostId() {
    if (!postId)
      throw new Error("postId is required");

    return postId;
  }

  const { data } = useQuery({
      queryKey: ["post", getPostId()],
      queryFn: async () => {
        const response = await api.api.postGetList({ postId: getPostId() });
        return observable(response.data);
      },
      enabled: postId != null
  });

  return (
    <div>
      {!data ? (
        <Skeleton className="h-64 w-full rounded-xl my-4">
          <span className="flex h-full w-full items-center justify-center text-informational">
            {t("common:loading")}
          </span>
        </Skeleton>
      ) : (
        <div className="flex flex-col gap-6">
          <HiveMimePost post={data} />
          <HiveMimeCommentBrowse post={data} />
        </div>
      )}
    </div>
  );
}
