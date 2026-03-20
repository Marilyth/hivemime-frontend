"use client";

import { HiveMimeHiveCreate } from "@/components/ui/custom/hive-create/hm-hive";


export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183 flex flex-col gap-4">
        <HiveMimeHiveCreate />
      </div>
    </div>
  );
}
