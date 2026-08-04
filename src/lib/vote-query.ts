import { observable } from "mobx";
import { BooleanOperator, CandidateDto, PollDto, PostDto, FilterQuery, FilterQueryGroup } from "./Api";

export function createFilterQuery(): FilterQuery {
  return observable<FilterQuery>({ isNegated: false, leftOperator: BooleanOperator.And });
}

export function createFilterQueryGroup(): FilterQueryGroup {
  return observable<FilterQueryGroup>({ isNegated: false, leftOperator: BooleanOperator.And, children: [] });
}

export function isFilterQuery(x: unknown): x is FilterQuery {
  return !!x && typeof x === "object" && !Array.isArray((x as { children?: unknown }).children);
}

export function isFilterQueryGroup(x: unknown): x is FilterQueryGroup {
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
