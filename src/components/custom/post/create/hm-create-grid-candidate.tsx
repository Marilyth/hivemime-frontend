"use client";

import { CreatePollDto, CreateCandidateDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { getReferenceId } from "@/lib/utils";
import { mediaFiles } from "./hm-create-post";
import { ImageEditorContent } from "../../utility/image-viewer";


interface HiveMimeCreateGridCandidateProps {
  candidate: CreateCandidateDto;
  poll: CreatePollDto;
}

export interface HiveMimeCreateGridCandidatesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateGridCandidates = observer(({ poll }: HiveMimeCreateGridCandidatesProps) => {
  if (poll.candidates!.length === 0) {
    poll.candidates!.push({ name: "Candidate", description: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <HiveMimeCreateGridCandidate candidate={poll.candidates![0]} poll={poll} />
    </div>
  );
});


const HiveMimeCreateGridCandidate = observer(({ candidate, poll }: HiveMimeCreateGridCandidateProps) => {
  function handleFileChange(file: File | null, thumbnail: File | null) {
    if (!file || !thumbnail) {
      mediaFiles.delete(getReferenceId(candidate));
      mediaFiles.delete(getReferenceId(candidate) + "-thumb");
      candidate.media = undefined;
      candidate.name = "Grid";

      return;
    }

    mediaFiles.set(getReferenceId(candidate), file);
    mediaFiles.set(getReferenceId(candidate) + "-thumb", thumbnail);
    candidate.media = {
      contentLength: file.size,
      thumbnailContentLength: thumbnail.size,
      contentType: file.type
    };

    candidate.name = "Grid";
    poll.rows = undefined;
    poll.columns = undefined;
  }

  return (
    <ImageEditorContent src={mediaFiles.get(getReferenceId(candidate))} thumb={mediaFiles.get(getReferenceId(candidate) + "-thumb")} onChange={handleFileChange} />
  );
});
