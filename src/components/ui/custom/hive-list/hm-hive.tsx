"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileChartColumn } from "lucide-react"
import { Api, HiveDto } from "@/lib/Api";
import { HTMLAttributes, useContext, useState } from "react";
import { HiveMimeApiContext } from "@/app/layout";
import { observer } from "mobx-react-lite";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "../../button";
import { useRouter } from "next/navigation";
import { HiveMimeExpandableText } from "../hm-expandable-text";

export type HiveMimeHiveListItemProps = {
  hive: HiveDto;
} & HTMLAttributes<HTMLDivElement>;

export const HiveMimeHiveListItem = observer(({ hive, ...props }: HiveMimeHiveListItemProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const router = useRouter();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  async function joinHive() {
    // TODO: Implement real join functionality.
  }

  function browseHive() {
    router.push(`/posts?hiveId=${hive.id}`);
  }

  return (
    <div {...props}>
      <Card className="text-sm">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Button
              variant="link"
              className="h-auto flex-1 whitespace-normal break-words p-0 text-left text-lg font-bold line-clamp-2"
              onClick={browseHive}
            >
              {hive.name}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-20 flex-shrink-0"
              onClick={joinHive}>
              Join
            </Button>
          </div>

          <HiveMimeExpandableText className="text-muted-foreground" lines={3}>
            {hive.description}
          </HiveMimeExpandableText>
        </CardContent>
        <CardFooter className="gap-4 text-muted-foreground">
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
