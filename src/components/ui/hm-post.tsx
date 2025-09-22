"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowDownWideNarrow, User } from "lucide-react"
import { Badge } from "./badge";
import HiveMimePoll from "./hm-poll";

export default function HiveMimePost() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2">
                <span className="text-gray-500 text-sm">Username needs to know</span>
              </div>
              <span className="font-bold text-honey-brown">What is your favourite fruit?</span>
            </div>
            <ArrowDownWideNarrow className="ml-auto text-gray-500"/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span>
          I was thinking about fruit a lot lately. It is great food. But what is the BEST fruit? Please help a drone out, hivemind!
        </span>
        <div className="mt-4">
          <HiveMimePoll />
        </div>
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
}
