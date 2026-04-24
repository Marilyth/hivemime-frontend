import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Settings } from "lucide-react";
import { UserAccountSettings } from "./user-account-settings";
import { UserPrivacySettings } from "./user-privacy-settings";
import { useQueryParam } from "../../utility/use-query-param";

export function UserSettings() {
  const [tab, setTab] = useQueryParam("tab", "account");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <Settings className="text-muted-foreground" /> User Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tab!} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-4">
            <UserAccountSettings />
          </TabsContent>
          <TabsContent value="privacy" className="mt-4">
            <UserPrivacySettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
