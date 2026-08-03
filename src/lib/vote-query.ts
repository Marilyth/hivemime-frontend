import { observable } from "mobx";
import { BooleanOperator, CandidateDto, PollDto, PostDto, VoteQuery, VoteQueryGroup } from "./Api";

export function createVoteQuery(): VoteQuery {
  return observable<VoteQuery>({ isNegated: false, leftOperator: BooleanOperator.And });
}

export function createVoteQueryGroup(): VoteQueryGroup {
  return observable<VoteQueryGroup>({ isNegated: false, leftOperator: BooleanOperator.And, children: [] });
}

export function isVoteQuery(x: unknown): x is VoteQuery {
  return !!x && typeof x === "object" && !Array.isArray((x as { children?: unknown }).children);
}

export function isVoteQueryGroup(x: unknown): x is VoteQueryGroup {
  return !!x && typeof x === "object" && Array.isArray((x as { children?: unknown }).children);
}

export function resolveCandidate(
  post: PostDto,
  candidateId?: string | null
): { poll?: PollDto; candidate?: CandidateDto } {
  if (!candidateId) return {};

  for (const poll of post.polls ?? []) {
    const candidate = (poll.candidates ?? []).find((c) => c.id === candidateId);
    if (candidate) return { poll, candidate };
  }

  return {};
}
