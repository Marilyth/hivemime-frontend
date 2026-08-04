"use client";

import { useState } from "react";
import { HiveMimeDrilldownDatePicker, DrilldownStep } from "@/components/custom/utility/hm-drilldown-datepicker";

const STEP_LABELS: { step: DrilldownStep; label: string }[] = [
  { step: 0, label: "1 minute" },
  { step: 1, label: "5 minutes" },
  { step: 2, label: "15 minutes" },
  { step: 3, label: "1 hour" },
  { step: 4, label: "1 day" },
  { step: 5, label: "1 month" },
  { step: 6, label: "1 year" },
];

function StepPreview({ step, label }: { step: DrilldownStep; label: string }) {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-sm text-muted-foreground">step = {step}s</div>
      </div>

      <HiveMimeDrilldownDatePicker step={step} onChange={setDate} />

      <div className="text-sm text-muted-foreground">
        Selected: {date ? date.toLocaleString() : "—"}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Drill-down date/time picker</h1>
        <p className="text-muted-foreground">
          A hierarchical picker navigating Year → Month → Day → Hour → Minute.
          Select a unit at the finest scope to commit. The step size trims the
          drill-down structure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STEP_LABELS.map(({ step, label }) => (
          <StepPreview key={step} step={step} label={label} />
        ))}
      </div>
    </div>
  );
}
