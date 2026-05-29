import { Card, CardContent } from "@/components/ui/card";
import { useQueryParam } from "../../utility/use-query-param";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileHeader } from "./user-profile-header";
import { useQuery } from "@tanstack/react-query";
import { api, userStore } from "@/lib/contexts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { HiveMimePostBrowse } from "../../post/hm-post-browse";
import { PostOrderBy } from "@/lib/Api";
import { UserProfileComments } from "./user-profile-comments";
import { useTranslation } from "react-i18next";

export function UserProfile() {
  const { t } = useTranslation();
  const [userData, setUserData] = useQueryParam("id", userStore.user?.id!.toString() ?? null);
  const [tab, setTab] = useQueryParam("tab", "posts");

  const { data } = useQuery({
    queryKey: ["userProfile", userData],
    enabled: userData !== null,
    queryFn: async () => {
      const task = api.api.userProfileList({ userId: Number(userData) });
      toast.promise(task, {
        loading: t("toasts:profile.loadingUser")
      });

      const res = await task;
      return res.data;
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-0 p-0">
        <CardContent className="p-2!">
          {data && <UserProfileHeader user={data} />}
        </CardContent>
      </Card>
      <Tabs defaultValue={tab!} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="posts">
            {t("settings:profile.posts")}
            <Badge>{data?.postCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="comments">
            {t("settings:profile.comments")}
            <Badge>{data?.commentCount}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-4">
          <HiveMimePostBrowse orderBy={PostOrderBy.New} userId={Number(userData)} />
        </TabsContent>
        <TabsContent value="comments" className="mt-4">
          {data && <UserProfileComments user={data} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}