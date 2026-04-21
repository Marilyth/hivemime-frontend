"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { User, FileChartColumn } from "lucide-react"
import { Api, HiveDto } from "@/lib/Api";
import { HTMLAttributes, useContext } from "react";
import { FollowedHivesContext, HiveMimeApiContext } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HiveMimeExpandableText } from "../../utility/hm-expandable-text";
import { AsyncButton } from "../../utility/async-button";

export type HiveMimeHiveListItemProps = {
  hive: HiveDto;
} & HTMLAttributes<HTMLDivElement>;

export const HiveMimeHiveListItem = observer(({ hive, ...props }: HiveMimeHiveListItemProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const followedHivesContext = useContext(FollowedHivesContext)!;
  const router = useRouter();

  async function leaveHive() {
    const task = hiveMimeService.api.hiveLeaveCreate({ hiveId: hive.id });
    toast.promise(task, {
      loading: 'Leaving hive...',
      success: () =>{
        followedHivesContext.setFollowedHives(followedHivesContext.followedHives.filter(h => h.id !== hive.id));
        return "Hive left successfully!";
      },
      error: 'Failed to leave hive.'
    });

    await task;
  }

  async function joinHive() {
    const task = hiveMimeService.api.hiveJoinCreate({ hiveId: hive.id });
    toast.promise(task, {
      loading: 'Joining hive...',
      success: () =>{
        followedHivesContext.setFollowedHives([...followedHivesContext.followedHives, hive]);
        return "Hive joined successfully!";
      },
      error: 'Failed to join hive.'
    });

    await task;
  }

  function browseHive() {
    router.push(`/posts?hiveId=${hive.id}`);
  }

  return (
    <div {...props}>
      <Card className="text-sm min-h-56">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Button
              variant="link"
              className="h-auto flex-1 whitespace-normal text-honey-brown break-words p-0 text-left text-lg font-bold line-clamp-2"
              onClick={browseHive}
            >
              {hive.name}
            </Button>

            <AsyncButton
              variant="outline"
              size="sm"
              className="w-20 flex-shrink-0"
              onClick={followedHivesContext.followedHives.some(h => h.id === hive.id) ? leaveHive : joinHive}
            >
              {followedHivesContext.followedHives.some(h => h.id === hive.id) ? "Leave" : "Join"}
            </AsyncButton>
          </div>

          <HiveMimeExpandableText className="text-muted-foreground" lines={3}>
            {hive.description}
          </HiveMimeExpandableText>
        </CardContent>
        <CardFooter className="gap-4 text-muted-foreground mt-auto">
          <Label>
            <User className="mr-1 inline-block h-4 w-4" />
            {hive.followerCount} followers
          </Label>
          <Label>
            <FileChartColumn className="mr-1 inline-block h-4 w-4" />
            {hive.postCount} posts
          </Label>
        </CardFooter>
      </Card>
    </div>
  );
});
