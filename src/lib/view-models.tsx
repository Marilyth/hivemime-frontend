import { PollCandidateDto, UpsertVoteToCandidateDto } from "./Api";

export interface CombinedPollCandidate {
  candidate: PollCandidateDto;
  vote: UpsertVoteToCandidateDto;
}