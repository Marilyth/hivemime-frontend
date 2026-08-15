import { observable } from "mobx";
import { BooleanOperator, CandidateDto, PollDto, PostDto, FilterQuery, FilterQueryGroup, FilterQueryBase, SubProperty, ValueOperator } from "./Api";
import { QuadAnd, QuadBoolean, QuadNot, QuadOr } from "./quad-bool";


export function createFilterQuery(): FilterQuery {
  return observable<FilterQuery>({ isNegated: false, leftOperator: BooleanOperator.And });
}

export function createFilterQueryGroup(): FilterQueryGroup {
  return observable<FilterQueryGroup>({ isNegated: false, leftOperator: BooleanOperator.And, children: [] });
}

// UI-only operator used by the query builder as a shortcut for multiple "Equals" conditions
export const InsideOperator = "Inside" as ValueOperator;

// Frontend-only sub-property used by the grid condition builder to pick whole cells. It is
// never sent to the backend: on commit it is expanded into groups of Row AND Column conditions.
export const CellSubProperty = "Cell" as SubProperty;

export function expandCellConditions(query: FilterQueryBase): FilterQueryBase {
  if (isFilterQuery(query)) {
    if (query.subProperty !== CellSubProperty)
      return query;

    const cells = (query.value ?? "").split(",").filter(cell => cell !== "");
    const group = createFilterQueryGroup();
    group.isNegated = query.isNegated;
    group.leftOperator = query.leftOperator ?? BooleanOperator.Or;
    group.children = cells.map((cell) => {
      const [row, col] = cell.split(":").map(Number);

      const cellGroup = createFilterQueryGroup();
      cellGroup.leftOperator = BooleanOperator.Or;
      cellGroup.children = [
        {
          isNegated: false,
          leftOperator: BooleanOperator.And,
          property: query.property,
          subProperty: SubProperty.Row,
          valueOperator: ValueOperator.Equals,
          value: String(row),
        },
        {
          isNegated: false,
          leftOperator: BooleanOperator.And,
          property: query.property,
          subProperty: SubProperty.Column,
          valueOperator: ValueOperator.Equals,
          value: String(col),
        },
      ];
      return cellGroup;
    });

    return group;
  }

  const group = query as FilterQueryGroup;
  group.children = group.children?.map(expandCellConditions);
  return query;
}

// Mirrors the backend's FilterQueryBase.CleanUp(): removes empty groups and collapses
// groups with a single child in-place, transferring the group's negation onto the child.
export function cleanUpQuery(query: FilterQueryBase | null): FilterQueryBase | null {
  if (query == null || isFilterQuery(query))
    return query;

  const group = query as FilterQueryGroup;

  for (let i = group.children!.length - 1; i >= 0; i--) {
    const child = cleanUpQuery(group.children![i]);

    if (child == null)
      group.children!.splice(i, 1);
    else
      group.children![i] = child;
  }

  if (group.children!.length === 1) {
    const child = group.children![0];
    child.isNegated = group.isNegated !== child.isNegated;
    return child;
  }

  if (group.children!.length === 0)
    return null;

  return group;
}

export function expandInsideOperators(query: FilterQueryBase): FilterQueryBase {
  if (isFilterQuery(query)) {
    if (query.valueOperator !== InsideOperator)
      return query;

    const values = (query.value ?? "").split(",").filter(value => value !== "");
    const group = createFilterQueryGroup();
    group.isNegated = query.isNegated;
    group.leftOperator = query.leftOperator;
    group.children = values.map((value, index) => ({
      isNegated: false,
      leftOperator: BooleanOperator.Or,
      property: query.property,
      subProperty: query.subProperty,
      valueOperator: ValueOperator.Equals,
      value,
    }));
    return group;
  }

  const group = query as FilterQueryGroup;
  group.children = group.children?.map(expandInsideOperators);
  return query;
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

  // Order-based fallback ("pollOrder:candidateOrder"), used when the candidate has no id yet.
  if (candidateId.includes(":")) {
    const [pollIndex, candidateIndex] = candidateId.split(":").map(Number);
    const poll = post.polls?.[pollIndex];
    return { poll, candidate: poll?.candidates?.[candidateIndex] };
  }

  for (const poll of post.polls ?? []) {
    const candidate = (poll.candidates ?? []).find((c) => c.id === candidateId);
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

export class QueryEvaluation {
  private filter: FilterQueryBase;
  private leftChild: QueryEvaluation | undefined;
  private rightChild: QueryEvaluation | undefined;

  constructor(filter: FilterQueryBase) {
    this.filter = filter;

    if (isFilterQueryGroup(filter)) {
      if (filter.children![0] != null)
        this.leftChild = new QueryEvaluation(filter.children![0]);
      if (filter.children![1] != null)
        this.rightChild = new QueryEvaluation(filter.children![1]);
    }
  }

  public getDeepEvaluationState(evaluator: (filter: FilterQuery) => QuadBoolean): QuadBoolean {
    let deepEvaluationState: QuadBoolean = QuadBoolean.No;

    if (isFilterQuery(this.filter)) {
      deepEvaluationState = evaluator(this.filter);
    }
    else if (this.leftChild == null && this.rightChild == null) {
      // Empty group (e.g. a date poll with no conditions yet) imposes no restriction.
      deepEvaluationState = QuadBoolean.Yes;
    }
    else if (this.leftChild == null || this.rightChild == null) {
      deepEvaluationState = (this.leftChild ?? this.rightChild)!.getDeepEvaluationState(evaluator);
    }
    else {
      const leftState = this.leftChild.getDeepEvaluationState(evaluator);
      const rightState = this.rightChild.getDeepEvaluationState(evaluator);

      if (this.rightChild.filter.leftOperator == BooleanOperator.And)
        deepEvaluationState = QuadAnd(leftState, rightState);
      else
        deepEvaluationState = QuadOr(leftState, rightState);
    }

    if (this.filter.isNegated)
      deepEvaluationState = QuadNot(deepEvaluationState);

    return deepEvaluationState;
  }
}
