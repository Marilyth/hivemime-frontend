"use client";

import { CreatePollDto, CreateCandidateDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useTranslation } from "react-i18next";

export interface HiveMimeCreateDateCandidatesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateDateCandidates = observer(({ poll }: HiveMimeCreateDateCandidatesProps) => {
  const { t } = useTranslation();

  function addDate() {
    poll.candidates!.push({ name: new Date().toISOString(), description: "" });
  }

  function setDate(candidate: CreateCandidateDto, date: Date | null) {
    if (!date)
      return;

    candidate.name = date.toISOString();
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {poll.candidates!.map((candidate) => (
          <motion.div layout
            key={getReferenceId(candidate)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, marginBottom: -4, marginTop: -4 }}>
            <div className="flex flex-row items-center gap-2 border rounded-md px-2 py-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex-1 justify-start text-left">
                    {candidate.name ? new Date(candidate.name).toLocaleDateString() : t("posts:create.pickDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={candidate.name ? new Date(candidate.name) : undefined}
                    onSelect={(date) => setDate(candidate, date)}
                    showOutsideDays={false}
                    required
                  />
                </PopoverContent>
              </Popover>

              <Button variant="ghost"
                className="text-muted-foreground hover:text-failure p-1! h-auto"
                onClick={() => poll.candidates!.splice(poll.candidates!.indexOf(candidate), 1)}>
                  <Trash2 />
              </Button>
            </div>
          </motion.div>
        ))}

        <Button variant="outline" onClick={addDate} className="w-full">
          <Plus />{t("posts:create.addDate")}
        </Button>
      </AnimatePresence>
    </div>
  );
});
