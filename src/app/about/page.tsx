"use client";

import { LocationPicker, LocationRectangles } from "@/components/custom/utility/location-picker";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="h-100 w-100 bg-black/50">
      <LocationPicker rectangles={new LocationRectangles(3)} />
    </div>
  );
}
