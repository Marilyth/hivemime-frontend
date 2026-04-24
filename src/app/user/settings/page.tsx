"use client";

import { UserSettings } from "@/components/custom/user/settings/user-settings";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-183 gap-4">
        <UserSettings />
      </div>
    </div>
  );
}
