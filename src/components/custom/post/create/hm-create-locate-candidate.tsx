"use client";

import { CreatePollDto, CreateCandidateDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { getReferenceId } from "@/lib/utils";
import { mediaFiles } from "./hm-create-post";
import { ImageEditorContent } from "../../utility/image-viewer";


interface HiveMimeCreateLocateCandidateProps {
  candidate: CreateCandidateDto;
}

export interface HiveMimeCreateLocateCandidatesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateLocateCandidates = observer(({ poll }: HiveMimeCreateLocateCandidatesProps) => {
  if (poll.candidates!.length === 0) {
    poll.candidates!.push({ name: "Candidate", description: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <HiveMimeCreateLocateCandidate candidate={poll.candidates![0]} />
    </div>
  );
});


const HiveMimeCreateLocateCandidate = observer(({ candidate }: HiveMimeCreateLocateCandidateProps) => {
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
  }

  return (
    <ImageEditorContent src={mediaFiles.get(getReferenceId(candidate))} thumb={mediaFiles.get(getReferenceId(candidate) + "-thumb")} onChange={handleFileChange} />
  );
});
