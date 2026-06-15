"use client";

import { CreatePollDto, PollType, CreateCandidateDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { Button } from "../../../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../utility/hm-draggable";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useEffect } from "react";
import { mediaFiles } from "./hm-create-post";
import { ImageEditor } from "../../utility/image-viewer";
import { reaction } from "mobx";
import { useTranslation } from "react-i18next";


interface HiveMimeCreateCandidateProps {
  candidates: CreateCandidateDto[];
  candidate: CreateCandidateDto;
}

export interface HiveMimeCreateCandidatesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateCandidates = observer(({ poll }: HiveMimeCreateCandidatesProps) => {
  const { t } = useTranslation();

  function addCandidate() {
    poll.candidates!.push({ name: t("posts:create.defaultCandidateName", { index: poll.candidates!.length + 1 }), description: "" });
  }

  function handleCandidateCountChanged(current: number, previous: number) {
    if (current > previous) {
      if (poll.minVotes! == poll.candidates!.length - 1 && poll.pollType != PollType.Choice) {
        poll.minVotes = poll.candidates!.length;
      }

      if (poll.maxVotes! == poll.candidates!.length - 1) {
        poll.maxVotes = poll.candidates!.length;
      }

      return;
    }

    if (poll.candidates!.length < poll.maxVotes!) {
      poll.maxVotes = poll.candidates!.length;
    }

    if (poll.candidates!.length < poll.minVotes!) {
      poll.minVotes = poll.candidates!.length;
    }
  }

  useEffect(() => reaction(
      () => poll.candidates!.length,
      handleCandidateCountChanged), [poll]);

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {poll.candidates!.map((option) => (
          <motion.div layout
            key={getReferenceId(option)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto"}}
            exit={{ opacity: 0, height: 0, marginBottom: -4, marginTop: -4 }}>
              <HiveMimeDraggable hasHandle isDraggable isDropArea isSticky data={option} dataList={poll.candidates!} allowedZones={['top', 'bottom']}>
              <HiveMimeCreateCandidate candidates={poll.candidates!} candidate={option} />
              </HiveMimeDraggable>
          </motion.div>
        ))}

        <Button variant="outline" onClick={addCandidate} className="w-full">
          <Plus />{t("posts:create.addCandidate")}
        </Button>
      </AnimatePresence>
    </div>
  );
});


export const HiveMimeCreateCandidate = observer(({ candidates, candidate }: HiveMimeCreateCandidateProps) => {
  const { t } = useTranslation();

  function handleFileChange(file: File | null, thumbnail: File | null) {
    if (!file || !thumbnail) {
      mediaFiles.delete(getReferenceId(candidate));
      mediaFiles.delete(getReferenceId(candidate) + "-thumb");
      candidate.media = undefined;

      return;
    }

    mediaFiles.set(getReferenceId(candidate), file);
    mediaFiles.set(getReferenceId(candidate) + "-thumb", thumbnail);
    candidate.media = {
      contentLength: file.size,
      thumbnailContentLength: thumbnail.size,
      contentType: file.type
    };
  }

  return (
    <InputGroup className="hover:border-honey-brown transition-colors duration-200 bg-transparent! h-auto">
      <InputGroupAddon>
        <ImageEditor src={mediaFiles.get(getReferenceId(candidate))} thumb={mediaFiles.get(getReferenceId(candidate) + "-thumb")} onChange={handleFileChange}></ImageEditor>
      </InputGroupAddon>

      <InputGroupInput placeholder={t("posts:create.candidateNamePlaceholder")} value={candidate.name!} onChange={(e) => candidate.name = e.target.value} />

      <InputGroupAddon align="inline-end">
        <Button variant="ghost"
          className="text-muted-foreground hover:text-failure p-1! h-auto"
          onClick={() => candidates.splice(candidates.indexOf(candidate), 1)}>
            <Trash2 />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
});
