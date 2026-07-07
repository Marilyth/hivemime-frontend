import { LocationRectangles } from "@/components/custom/utility/location-picker";
import { CandidateVoteDto } from "./Api";

export type UiCandidateVote = CandidateVoteDto & {
  selected?: boolean;
  score?: number;
  rank?: number;
  categoryId?: string;
  rectangles?: LocationRectangles;
};

export interface UiPollVoteDto {
  id?: string;
  candidates?: UiCandidateVote[] | null;
}

export interface UiPostVoteDto {
  id?: string;
  polls?: UiPollVoteDto[] | null;
}
