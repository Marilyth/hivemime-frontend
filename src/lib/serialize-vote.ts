import {
  CandidateCategoryVoteDto,
  CandidateChoiceVoteDto,
  CandidateDateVoteDto,
  CandidateDrawVoteDto,
  CandidateRankVoteDto,
  CandidateScoreVoteDto,
  PollDto,
  PollType,
  PollVoteDto,
  PostDto,
  PostVoteDto,
} from "./Api";
import { UiCandidateVote, UiPostVoteDto } from "./vote-models";

function serializeCandidateVote(
  poll: PollDto,
  candidate: UiCandidateVote,
): CandidateChoiceVoteDto | CandidateScoreVoteDto | CandidateRankVoteDto | CandidateCategoryVoteDto | CandidateDrawVoteDto[] | CandidateDateVoteDto[] | null {
  const base = { id: candidate.id, name: candidate.name };

  switch (poll.pollType) {
    case PollType.Choice:
      if (!candidate.selected) return null;
      return base;

    case PollType.Score:
      if (candidate.score == null) return null;
      return { ...base, score: candidate.score };

    case PollType.Rank:
      if (candidate.rank == null) return null;
      return { ...base, rank: candidate.rank };

    case PollType.Category:
      if (!candidate.categoryId) return null;
      return { ...base, categoryId: candidate.categoryId };

    case PollType.Draw:
      if (!candidate.cellSelection || candidate.cellSelection.cells.length === 0) return null;
      return candidate.cellSelection.cells
        .map((value, index) => ({ value: value, index }))
        .filter(c => c.value.value > 0)
        .map(c => ({ ...base, cellIndex: c.index }));

    case PollType.Date:
      if (!candidate.dateSelection || candidate.dateSelection.activeCount === 0) return null;
      return candidate.dateSelection.dates
        .map(t => ({ ...base, timestamp: t }));

    default:
      return null;
  }
}

export function serializePostVote(post: PostDto, uiVote: UiPostVoteDto): PostVoteDto {
  return {
    id: uiVote.id,
    polls: uiVote.polls!.map((pollVote, index) => {
      const poll = post.polls![index];
      const candidates = pollVote.candidates!
        .map((candidate) => serializeCandidateVote(poll, candidate))
        .filter((c): c is NonNullable<typeof c> => c != null);

      return {
        id: pollVote.id,
        candidates: candidates.flat(),
      } satisfies PollVoteDto;
    }),
  };
}
