import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Settings } from "lucide-react";
import { useQueryParam } from "../../utility/use-query-param";
import { HiveGeneralSettings } from "./hive-general-settings";
import { HiveRuleSettings } from "./hive-rule-settings";
import { useQuery } from "@tanstack/react-query";
import { api, followedHivesStore } from "@/lib/contexts";
import { observable } from "mobx";
import { HiveMembersSettings } from "./hive-members-settings";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MemberRole } from "@/lib/Api";
import { getRoleRank } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function HiveSettings() {
  const { t } = useTranslation();
  const [hiveId] = useQueryParam("hiveId");
  const [tab, setTab] = useQueryParam("tab", "general");
  const router = useRouter();
  const currentHiveUser = hiveId ? followedHivesStore.followedHives.get(hiveId) : undefined;
  const canViewSettings = currentHiveUser != null && (getRoleRank(currentHiveUser.role!) >= getRoleRank(MemberRole.Moderator));

  const hiveData = useQuery({
    queryKey: ["hive", hiveId],
    queryFn: async () => {
      const res = await api.api.hiveGetList({ hiveId: hiveId ?? undefined });
      return observable(res.data);
    }
  });

  return (
    canViewSettings ? <Card>
      <CardHeader className="flex flex-row">
        <CardTitle className="flex flex-row items-center gap-2">
          <Settings className="text-muted-foreground" /> {t("hives:settings.title")}
        </CardTitle>

        <Button variant="link" size="sm" className="ml-auto" onClick={() => router.push(`/posts?hiveId=${hiveId}`)}>
          {t("hives:settings.browsePosts")}
        </Button>
      </CardHeader>
      <CardContent>
        {!hiveData.isLoading && (
          <Tabs defaultValue={tab!} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="general">{t("hives:settings.general")}</TabsTrigger>
              <TabsTrigger value="rules">{t("hives:settings.rules")}</TabsTrigger>
              <TabsTrigger value="members">{t("hives:settings.members")}</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
              <HiveGeneralSettings hiveDto={hiveData.data!} currentUser={currentHiveUser!} />
            </TabsContent>
            <TabsContent value="rules" className="mt-4">
              <HiveRuleSettings hiveDto={hiveData.data!} currentUser={currentHiveUser!} />
            </TabsContent>
            <TabsContent value="members" className="mt-4">
              <HiveMembersSettings hiveDto={hiveData.data!} currentUser={currentHiveUser!} />
            </TabsContent>
          </Tabs>
        ) || (
          <div className="text-center py-10">
            {t("hives:settings.loading")}
          </div>
        )}
        
      </CardContent>
    </Card>
    : <div className="text-center py-10">{t("hives:settings.noPermission")}</div>
  );
}
