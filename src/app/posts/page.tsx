"use client";

import { HiveMimePostBrowse } from "@/components/custom/post/hm-post-browse";
import { useQueryParam } from "@/components/custom/utility/use-query-param";
import { PostOrderBy } from "@/lib/Api";

export default function Page() {
  const [userId, setUserId] = useQueryParam("userId");
  const [hiveId, setHiveId] = useQueryParam("hiveId");
  const [orderBy, setOrderBy] = useQueryParam("orderBy", PostOrderBy.Hot);
  
  return (
    <HiveMimePostBrowse
      hiveId={hiveId ? Number(hiveId) : undefined}
      userId={userId ? Number(userId) : undefined}
      orderBy={orderBy as PostOrderBy} />
  );
}
