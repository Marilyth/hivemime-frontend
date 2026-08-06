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

  // Strip a sub-value suffix ("pollOrder:candidateOrder.SubValue") before resolving.
  const base = candidateId.split(".")[0];

  // Order-based fallback ("pollOrder:candidateOrder"), used when the candidate has no id yet.
  if (base.includes(":")) {
    const [pollIndex, candidateIndex] = base.split(":").map(Number);
    const poll = post.polls?.[pollIndex];
    return { poll, candidate: poll?.candidates?.[candidateIndex] };
  }

  for (const poll of post.polls ?? []) {
    const candidate = (poll.candidates ?? []).find((c) => c.id === base);
    if (candidate) return { poll, candidate };
  }

  return {};
}
