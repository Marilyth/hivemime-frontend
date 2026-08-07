import { observable } from "mobx";
import { BooleanOperator, CandidateDto, PollDto, PostDto, FilterQuery, FilterQueryGroup, FilterQueryBase } from "./Api";

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

export function deepChildCount(group: FilterQueryGroup): number {
  return group.children!.reduce((acc, child) => acc + (isFilterQueryGroup(child) ? deepChildCount(child) : 1), 0);
}

export function canConvertToAST(group: FilterQueryGroup): boolean {
  if (group.children!.length > 2)
    return true;

  return group.children!.some((child) => isFilterQueryGroup(child) && canConvertToAST(child));
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

export function queryToBalancedAST(query: FilterQueryBase): FilterQueryBase {
  if (isFilterQuery(query))
    return query;

  const group = query as FilterQueryGroup;

  if (group.children!.length === 0)
    return group;

  if (group.children!.length === 1) {
    const newGroup = queryToBalancedAST(group.children![0]);
    newGroup.isNegated = group.isNegated !== newGroup.isNegated;

    return newGroup;
  }

  const middleIndex = Math.floor(group.children!.length / 2);
  let splitIndex = -1;

  for (let i = 1; i < group.children!.length && Math.abs(i - middleIndex) <= Math.abs(splitIndex - middleIndex); i++) {
    const child = group.children![i];

    if (child.leftOperator === BooleanOperator.Or)
      splitIndex = i;
  }

  splitIndex = splitIndex === -1 ? middleIndex : splitIndex;

  const left = group.children!.slice(0, splitIndex);
  const right = group.children!.slice(splitIndex);

  const leftGroup = createFilterQueryGroup();
  leftGroup.children = left;

  const rightGroup = createFilterQueryGroup();
  rightGroup.children = right;
  rightGroup.leftOperator = right[0].leftOperator;

  group.children = [queryToBalancedAST(leftGroup), queryToBalancedAST(rightGroup)];

  return group;
}