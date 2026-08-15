import {
  CandidateCategoryVoteDto,
  CandidateChoiceVoteDto,
  CandidateDateVoteDto,
  CandidateGridVoteDto,
  CandidateRankVoteDto,
  CandidateScoreVoteDto,
  PollDto,
  PollType,
  PollVoteDto,
  PostDto,
  PostVoteDto,
} from "./Api";
import { UiCandidateVote, UiPostVoteDto } from "./vote-models";
import { toGMT } from "./gmt";

function serializeCandidateVote(
  poll: PollDto,
  candidate: UiCandidateVote,
): CandidateChoiceVoteDto | CandidateScoreVoteDto | CandidateRankVoteDto | CandidateCategoryVoteDto | CandidateGridVoteDto[] | CandidateDateVoteDto[] | null {
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

    case PollType.Grid: {
      const cellSelection = candidate.cellSelection;
      if (!cellSelection || cellSelection.onCellsCount === 0) return null;

      const votes: CandidateGridVoteDto[] = [];

      for (let row = 0; row < cellSelection.rows; row++) {
        for (let col = 0; col < cellSelection.cols; col++) {
          if (cellSelection.viewCells[row][col].value > 0)
            votes.push({ ...base, row, column: col });
        }
      }

      return votes;
    }

    case PollType.Date:
      if (!candidate.dateSelection || candidate.dateSelection.activeCount === 0) return null;
      return candidate.dateSelection.dates
        .map(t => ({ ...base, timestamp: poll.ignoreTimeZone! ? t.date.getTime() : toGMT(t.date) }));

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
