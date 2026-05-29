"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User, FileChartColumn, Settings } from "lucide-react"
import { ApprovalStatus, HiveDto, MemberRole } from "@/lib/Api";
import { HTMLAttributes } from "react";
import { api, followedHivesStore } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HiveMimeExpandableText } from "../../utility/hm-expandable-text";
import { AsyncButton } from "../../utility/async-button";
import { getRoleColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export type HiveMimeHiveListItemProps = {
  hive: HiveDto;
} & HTMLAttributes<HTMLDivElement>;

export const HiveMimeHiveListItem = observer(({ hive, className, ...props }: HiveMimeHiveListItemProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const hiveFollow = followedHivesStore.followedHives.get(hive.id!);
  const isModerator = hiveFollow != null && hiveFollow.role !== MemberRole.Follower;
  const canJoin = hiveFollow == null || hiveFollow.role === MemberRole.Guest;

  async function leaveHive() {
    const task = api.api.hiveLeaveDelete({ followId: hiveFollow!.id });
    toast.promise(task, {
      loading: t("toasts:hive.leaving"),
      success: () =>{
        followedHivesStore.removeFollowedHive(hive.id!);
        return t("toasts:hive.left");
      }
    });

    await task;
  }

  async function joinHive() {
    const task = api.api.hiveJoinCreate({ hiveId: hive.id });
    await toast.promise(task, {
      loading: t("toasts:hive.joining"),
      success: (r) => {
        followedHivesStore.addFollowedHive(r.data);

        if (hive.settings?.joinRequiresApproval)
          return t("toasts:hive.joinRequestSent");
        else
          return t("toasts:hive.joined");
      }
    });

    await task;
  }

  function browseHive() {
    router.push(`/posts?hiveId=${hive.id}`);
  }

  return (
    <Card className={`pt-0 text-sm ${className}`} {...props}>
      <CardHeader className="p-6 flex flex-col border-b bg-muted/50 rounded-t-md">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-3 w-full">
            <Button
              variant="link"
              className="flex-1 h-auto whitespace-normal text-honey-brown break-words p-0 text-left text-lg font-bold line-clamp-2"
              onClick={browseHive}
            >
              {hive.name}
            </Button>
            
            {isModerator && <Button
              className="ml-auto"
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/hives/settings?hiveId=${hive.id}`)}
            >
              <Settings/>
            </Button>}

            <AsyncButton
              variant="outline"
              size="sm"
              onClick={canJoin ? joinHive : leaveHive}
            >
              {canJoin ? (hive.settings?.joinRequiresApproval ? t("hives:card.requestToJoin") : t("hives:card.join")) : t("hives:card.leave")}
            </AsyncButton>
          </div>
          {hiveFollow != null && (
            <div className="flex flex-row gap-2">
              {hiveFollow.approvalStatus != ApprovalStatus.Approved && <Badge variant="outline">
                {t(`enums:approvalStatus.${hiveFollow.approvalStatus!.toLowerCase()}`)}
              </Badge>}
              <Badge variant="outline" className={`${getRoleColor(hiveFollow.role!)}`}>
                {t(`enums:memberRole.${hiveFollow.role!.toLowerCase()}`)}
              </Badge>
            </div>
          )}
        </div>
        
      </CardHeader>
        
      <CardContent className="flex flex-col gap-3">
        <HiveMimeExpandableText className="text-muted-foreground" lines={3}>
          {hive.description}
        </HiveMimeExpandableText>
      </CardContent>
      <CardFooter className="gap-4 text-muted-foreground mt-auto">
        <Label>
          <User className="mr-1 inline-block h-4 w-4" />
          {t("hives:card.members", { count: hive.userCount })}
        </Label>
        <Label>
          <FileChartColumn className="mr-1 inline-block h-4 w-4" />
          {t("hives:card.posts", { count: hive.postCount })}
        </Label>
      </CardFooter>
    </Card>
  );
});
