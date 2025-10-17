import { PollCandidateDto, PollCategoryDto, UpsertVoteToCandidateDto } from "./Api";

export interface CombinedPollCandidate {
  candidate: PollCandidateDto;
  vote: UpsertVoteToCandidateDto;
}

export interface CombinedPollCategory {
  category: PollCategoryDto;
  value: number | null;
}