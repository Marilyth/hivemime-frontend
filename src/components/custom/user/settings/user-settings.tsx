import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Settings } from "lucide-react";
import { UserAccountSettings } from "./user-account-settings";
import { UserPrivacySettings } from "./user-privacy-settings";
import { useQueryParam } from "../../utility/use-query-param";
import { useTranslation } from "react-i18next";

export function UserSettings() {
  const { t } = useTranslation();
  const [tab, setTab] = useQueryParam("tab", "account");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <Settings className="text-muted-foreground" /> {t("settings:user.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tab!} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="account">{t("settings:user.account")}</TabsTrigger>
            <TabsTrigger value="privacy">{t("settings:user.privacy")}</TabsTrigger>
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
