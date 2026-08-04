"use client";

import { CreatePollDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";


export interface HiveMimeCreateDateCandidatesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateDateCandidates = observer(({ poll }: HiveMimeCreateDateCandidatesProps) => {
  const { t } = useTranslation();
  
  if (poll.candidates!.length === 0) {
    poll.candidates!.push({ name: "Date", description: "" });
  }

  if (!poll.minValue || !poll.maxValue) {
    const now = new Date();
    poll.minValue = now.getTime();
    poll.maxValue = now.getTime() + 60 * 60 * 24 * 1000 * 6;
  }

  function setStartDate(date: Date | null) {
    if (!date)
      return;

    poll.minValue = date.getTime();

    if (!poll.maxValue || poll.maxValue < poll.minValue) {
      poll.maxValue = poll.minValue + 60 * 60 * 24 * 1000;
    }
  }

  function setEndDate(date: Date | null) {
    if (!date)
      return;

    poll.maxValue = date.getTime();

    if (!poll.minValue || poll.minValue > poll.maxValue) {
      poll.minValue = poll.maxValue - 60 * 60 * 24 * 1000;
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Field>
        <FieldLabel>{t("posts:create.precision")}</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-fit!">
              {poll.minValue ? new Date(poll.minValue).toLocaleDateString() : <span>Pick a date</span>}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={poll.minValue ? new Date(poll.minValue) : undefined}
              onSelect={setStartDate}
              modifiers={{endDate: poll.maxValue ? new Date(poll.maxValue) : undefined}}
              modifiersClassNames={{
                endDate: "border border-honey-brown rounded-md border-dashed",
              }}
              showOutsideDays={false}
              required
            />
          </PopoverContent>
        </Popover>
      </Field>

      <div className="flex flex-row gap-2 items-center">
        <Field className="flex-1">
          <FieldLabel>{t("posts:create.startDate")}</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-fit!">
                {poll.minValue ? new Date(poll.minValue).toLocaleDateString() : <span>Pick a date</span>}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={poll.minValue ? new Date(poll.minValue) : undefined}
                onSelect={setStartDate}
                modifiers={{endDate: poll.maxValue ? new Date(poll.maxValue) : undefined}}
                modifiersClassNames={{
                  endDate: "border border-honey-brown rounded-md border-dashed",
                }}
                showOutsideDays={false}
                required
              />
            </PopoverContent>
          </Popover>
        </Field>

        <span className="self-end mb-2">-</span>

        <Field>
          <FieldLabel>{t("posts:create.endDate")}</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-fit!">
                {poll.maxValue ? new Date(poll.maxValue).toLocaleDateString() : <span>Pick a date</span>}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={poll.maxValue ? new Date(poll.maxValue) : undefined}
                onSelect={setEndDate}
                modifiers={{startDate: poll.minValue ? new Date(poll.minValue) : undefined}}
                modifiersClassNames={{
                  startDate: "border border-honey-brown rounded-md border-dashed",
                }}
                showOutsideDays={false}
                required
              />
            </PopoverContent>
          </Popover>
        </Field>
      </div>
    </div>
  );
});
