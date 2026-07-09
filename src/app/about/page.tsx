"use client";

import { DrawPicker, CellSelection } from "@/components/custom/utility/draw-picker";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="w-128 h-256 overflow-hidden flex">
      <DrawPicker cellSelection={new CellSelection(4, 4, 1000)}>
        <img src="http://localhost:3000/HiveMimeIcon.png" className="block max-w-full max-h-full object-contain"></img>
      </DrawPicker>
    </div>
  );
}
