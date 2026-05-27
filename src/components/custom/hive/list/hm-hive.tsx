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

export type HiveMimeHiveListItemProps = {
  hive: HiveDto;
} & HTMLAttributes<HTMLDivElement>;

export const HiveMimeHiveListItem = observer(({ hive, className, ...props }: HiveMimeHiveListItemProps) => {
  const router = useRouter();
  const hiveFollow = followedHivesStore.followedHives.get(hive.id!);
  const isModerator = hiveFollow != null && hiveFollow.role !== MemberRole.Follower;

  async function leaveHive() {
    const task = api.api.hiveLeaveDelete({ followId: hiveFollow!.id });
    toast.promise(task, {
      loading: 'Leaving hive...',
      success: () =>{
        followedHivesStore.removeFollowedHive(hive.id!);
        return "Hive left successfully!";
      }
    });

    await task;
  }

  async function joinHive() {
    const task = api.api.hiveJoinCreate({ hiveId: hive.id });
    await toast.promise(task, {
      loading: 'Joining hive...',
      success: (r) => {
        followedHivesStore.addFollowedHive(r.data);

        if (hive.settings?.mustBeApprovedToJoin)
          return "Join request sent! A moderator must approve it.";
        else
          return "Hive joined successfully!";
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
              disabled={hiveFollow != null && hiveFollow.approvalStatus == ApprovalStatus.Rejected}
              onClick={hiveFollow ? leaveHive : joinHive}
            >
              {hiveFollow ? (hiveFollow.approvalStatus ? "Leave" : "Abort request") : (hive.settings?.mustBeApprovedToJoin ? "Request to join" : "Join")}
            </AsyncButton>
          </div>
          {hiveFollow != null && (
            <span>
              You are a <span className={`${getRoleColor(hiveFollow.role!)}`}>{hiveFollow?.role}</span> of this hive.
            </span>
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
          {hive.userCount} members
        </Label>
        <Label>
          <FileChartColumn className="mr-1 inline-block h-4 w-4" />
          {hive.postCount} posts
        </Label>
      </CardFooter>
    </Card>
  );
});
