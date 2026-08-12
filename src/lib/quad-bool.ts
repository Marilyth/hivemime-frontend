
export enum QuadBoolean {
  No = -2,
  Maybe = 0,
  Partially = 1,
  Yes = 2
}

export function QuadAnd(leftState: QuadBoolean, rightState: QuadBoolean){
  if (leftState == QuadBoolean.No || rightState == QuadBoolean.No)
    return QuadBoolean.No;
  else if (leftState == QuadBoolean.Yes && rightState == QuadBoolean.Yes)
    return QuadBoolean.Yes;
  else if (leftState == QuadBoolean.Maybe || rightState == QuadBoolean.Maybe)
    return QuadBoolean.Maybe;

  return QuadBoolean.Partially;
}

export function QuadOr(leftState: QuadBoolean, rightState: QuadBoolean){
  if (leftState == QuadBoolean.Yes || rightState == QuadBoolean.Yes)
    return QuadBoolean.Yes;
  else if (leftState == QuadBoolean.No && rightState == QuadBoolean.No)
    return QuadBoolean.No;
  else if (leftState == QuadBoolean.Maybe || rightState == QuadBoolean.Maybe)
    return QuadBoolean.Maybe;

  return QuadBoolean.Partially;
}

export function QuadNot(state: QuadBoolean){
  if (state == QuadBoolean.No)
    return QuadBoolean.Yes;
  else if (state == QuadBoolean.Yes)
    return QuadBoolean.No;

  return state;
}