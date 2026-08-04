"use client";

import { useMemo } from "react";
import { DateSelection, HiveMimeDrilldownDatePicker, DrilldownStep, Variant } from "@/components/custom/utility/hm-drilldown-datepicker";

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
  const dateSelection = useMemo(() => new DateSelection(30), []);

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">Edit variant — click a unit at the finest scope to select it</div>
      </div>

      <HiveMimeDrilldownDatePicker step={step} dateSelection={dateSelection} />

      <div className="text-sm text-muted-foreground">
        Selected count: {dateSelection.onDatesCount}
      </div>
    </div>
  );
}

const SAMPLE_DATES = (() => {
  const base = new Date();
  const entries: [number, number][] = [];

  for (let yearOffset = -2; yearOffset <= 2; yearOffset++) {
    const year = base.getFullYear() + yearOffset;
    const daysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
    const count = 6 + Math.floor(Math.random() * 10);

    for (let i = 0; i < count; i++) {
      const dayOfYear = Math.floor(Math.random() * daysInYear);
      const date = new Date(year, 0, 1 + dayOfYear);
      entries.push([date.getTime(), 0.1 + Math.random() * 0.9]);
    }
  }

  return entries;
})();

function ResultPreview({ step, label }: { step: DrilldownStep; label: string }) {
  const dateSelection = useMemo(() => {
    const selection = new DateSelection(30);
    for (const [time, value] of SAMPLE_DATES) {
      selection.setValue(new Date(time), value);
    }
    return selection;
  }, []);

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">Result variant — hover a cell for its aggregated value</div>
      </div>

      <HiveMimeDrilldownDatePicker
        step={step}
        variant={Variant.Result}
        dateSelection={dateSelection}
      />
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

      <div>
        <h2 className="text-xl font-bold">Result variant</h2>
        <p className="text-muted-foreground">
          Values are aggregated per hovered cell and rendered as a gradient.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STEP_LABELS.map(({ step, label }) => (
          <ResultPreview key={step} step={step} label={label} />
        ))}
      </div>
    </div>
  );
}
