import {
  CandidateCategoryVoteDto,
  CandidateChoiceVoteDto,
  CandidateLocateVoteDto,
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
): CandidateChoiceVoteDto | CandidateScoreVoteDto | CandidateRankVoteDto | CandidateCategoryVoteDto | CandidateLocateVoteDto[] | null {
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

    case PollType.Locate:
      if (!candidate.rectangles || candidate.rectangles.rectangles.length === 0) return null;
      return candidate.rectangles.rectangles.map((rect) => ({
        ...base,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      }));

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
