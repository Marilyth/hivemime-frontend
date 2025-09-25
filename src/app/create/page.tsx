"use client";

import { HiveMimeCreatePost } from "@/components/ui/hm-create-post";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183 flex flex-col gap-4">
        <HiveMimeCreatePost />
      </div>
    </div>
  );
}
