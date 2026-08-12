import { CellSelection } from "@/components/custom/utility/draw-picker";
import { DateSelection } from "@/components/custom/utility/date-selection";
import { CandidateVoteDto } from "./Api";

export type UiCandidateVote = CandidateVoteDto & {
  selected?: boolean;
  score?: number;
  rank?: number;
  categoryId?: string;
  cellSelection?: CellSelection;
  dateSelection?: DateSelection;
};

export interface UiPollVoteDto {
  id?: string;
  candidates?: UiCandidateVote[] | null;
}

export interface UiPostVoteDto {
  id?: string;
  polls?: UiPollVoteDto[] | null;
}
