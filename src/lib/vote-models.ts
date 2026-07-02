import { CandidateVoteDto } from "./Api";

export type UiCandidateVote = CandidateVoteDto & {
  selected?: boolean;
  score?: number;
  rank?: number;
  categoryId?: string;
};

export interface UiPollVoteDto {
  id?: string;
  candidates?: UiCandidateVote[] | null;
}

export interface UiPostVoteDto {
  id?: string;
  polls?: UiPollVoteDto[] | null;
}
