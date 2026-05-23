import { CandidateDto } from "@/lib/Api";
import { ImageViewer } from "../utility/image-viewer";

export type HiveMimeViewCandidateProps = {
  candidate: CandidateDto;
} & React.HTMLAttributes<HTMLDivElement>;

export function HiveMimeViewCandidate({ candidate, className, ...props }: HiveMimeViewCandidateProps) {
  const thumbnail = candidate.mediaKeys?.find(key => key.endsWith("thumbnail.webp"));
  const src = candidate.mediaKeys?.find(key => !key.endsWith("thumbnail.webp"));

  return (
    <div className={`flex flex-row gap-2 items-center ${className}`} {...props}>
      {thumbnail && <ImageViewer src={src} alt={candidate.name!} thumb={thumbnail} />}
      <span className="font-medium">{candidate.name}</span>
    </div>
  );
}