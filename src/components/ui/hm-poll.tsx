"use client";

import { Card } from "@/components/ui/card";
import { ChartPie, Send } from "lucide-react"
import { Button } from "./button";
import HiveMimePickOption from "./hm-pick-option";


export default function HiveMimePoll() {
  return (
    <Card className="p-4">
        <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-sm">Please pick 1 option</span>
            <HiveMimePickOption value={"1"} name={"Apples"} />
            <HiveMimePickOption value={"2"} name={"Bananas"} />
            <HiveMimePickOption value={"3"} name={"Pears"} />
            
            <div className="flex flex-row mt-2">
                <Button className="w-full" variant={"outline"} disabled >
                    <Send />
                    Submit
                </Button>
            </div>
        </div>
    </Card>
  );
}
