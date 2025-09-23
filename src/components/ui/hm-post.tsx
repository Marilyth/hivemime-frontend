"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowDownWideNarrow, User } from "lucide-react"
import { Badge } from "./badge";
import HiveMimePoll from "./hm-poll";
import { Post } from "@/models/post";
import { observer } from "mobx-react-lite";
import { EmbeddedTabs, EmbeddedTabsContent, EmbeddedTabsList, EmbeddedTabsTrigger } from "./hm-embedded-tabs";

export interface HiveMimePostProps {
  post: Post;
}

export const HiveMimePost = observer(({ post }: HiveMimePostProps) => {
  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2">
                <span className="text-gray-500 text-sm">{post.userName} needs to know</span>
              </div>
              <span className="font-bold text-honey-brown">{post.title}</span>
            </div>
            <ArrowDownWideNarrow className="ml-auto text-gray-500"/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span>
          {post.content}
        </span>
        <EmbeddedTabs defaultValue="Main">
          <EmbeddedTabsList className="mt-4">
            <EmbeddedTabsTrigger value="Main">1</EmbeddedTabsTrigger>
            <EmbeddedTabsTrigger value="Sub1">2</EmbeddedTabsTrigger>
            <EmbeddedTabsTrigger value="Sub2">3</EmbeddedTabsTrigger>
          </EmbeddedTabsList>
          <EmbeddedTabsContent value="Main">
            <HiveMimePoll />
          </EmbeddedTabsContent>
          <EmbeddedTabsContent value="Sub1">
            How old are you?
            <HiveMimePoll />
          </EmbeddedTabsContent>
          <EmbeddedTabsContent value="Sub2">
            What is your favorite color?
            <HiveMimePoll />
          </EmbeddedTabsContent>
        </EmbeddedTabs>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row gap-4">
          <Badge variant={"outline"}>
            <User  />
            128
          </Badge>
          <Badge variant={"outline"}>
            <MessageSquare height={241} />
            64
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
});
