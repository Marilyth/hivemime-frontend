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

export function HiveSettings() {
  const [hiveId] = useQueryParam("hiveId");
  const [tab, setTab] = useQueryParam("tab", "general");
  const router = useRouter();
  const currentHiveUser = followedHivesStore.followedHives.get(Number(hiveId));
  const canViewSettings = currentHiveUser != null && (getRoleRank(currentHiveUser.role!) >= getRoleRank(MemberRole.Moderator));

  const hiveData = useQuery({
    queryKey: ["hive", hiveId],
    queryFn: async () => {
      const res = await api.api.hiveGetList({ hiveId: Number(hiveId) });
      return observable(res.data);
    }
  });

  return (
    canViewSettings ? <Card>
      <CardHeader className="flex flex-row">
        <CardTitle className="flex flex-row items-center gap-2">
          <Settings className="text-muted-foreground" /> Hive Settings
        </CardTitle>

        <Button variant="link" size="sm" className="ml-auto" onClick={() => router.push(`/posts?hiveId=${hiveId}`)}>
          Browse posts
        </Button>
      </CardHeader>
      <CardContent>
        {!hiveData.isLoading && (
          <Tabs defaultValue={tab!} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
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
            Loading hive data...
          </div>
        )}
        
      </CardContent>
    </Card>
    : <div className="text-center py-10">You do not have permission to view these settings.</div>
  );
}
