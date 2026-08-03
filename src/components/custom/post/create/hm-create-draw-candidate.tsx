"use client";

import { CreatePollDto, CreateCandidateDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { getReferenceId } from "@/lib/utils";
import { mediaFiles } from "./hm-create-post";
import { ImageEditorContent } from "../../utility/image-viewer";


interface HiveMimeCreateDrawCandidateProps {
  candidate: CreateCandidateDto;
  poll: CreatePollDto;
}

export interface HiveMimeCreateDrawCandidatesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateDrawCandidates = observer(({ poll }: HiveMimeCreateDrawCandidatesProps) => {
  if (poll.candidates!.length === 0) {
    poll.candidates!.push({ name: "Candidate", description: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <HiveMimeCreateDrawCandidate candidate={poll.candidates![0]} poll={poll} />
    </div>
  );
});


const HiveMimeCreateDrawCandidate = observer(({ candidate, poll }: HiveMimeCreateDrawCandidateProps) => {
  function handleFileChange(file: File | null, thumbnail: File | null) {
    if (!file || !thumbnail) {
      mediaFiles.delete(getReferenceId(candidate));
      mediaFiles.delete(getReferenceId(candidate) + "-thumb");
      candidate.media = undefined;
      candidate.name = "Candidate";

      return;
    }

    mediaFiles.set(getReferenceId(candidate), file);
    mediaFiles.set(getReferenceId(candidate) + "-thumb", thumbnail);
    candidate.media = {
      contentLength: file.size,
      thumbnailContentLength: thumbnail.size,
      contentType: file.type
    };

    candidate.name = file.name;
    poll.rows = undefined;
    poll.columns = undefined;
  }

  return (
    <ImageEditorContent src={mediaFiles.get(getReferenceId(candidate))} thumb={mediaFiles.get(getReferenceId(candidate) + "-thumb")} onChange={handleFileChange} />
  );
});
