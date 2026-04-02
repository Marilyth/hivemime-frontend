import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ValueOperator } from "./query-builder";

const ids = new WeakMap();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReferenceId(obj: WeakKey) {
  if (!ids.has(obj))
    ids.set(obj, crypto.randomUUID());

  return ids.get(obj);
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function valueOperatorToInlineString(operator: ValueOperator) {
  switch (operator) {
    case ValueOperator.Equals:
      return "equal to";
    case ValueOperator.Greater:
      return "greater than";
    case ValueOperator.GreaterEquals:
      return "greater than or equal to";
    case ValueOperator.Less:
      return "less than";
    case ValueOperator.LessEquals:
      return "less than or equal to";
    default:
      return operator;
  }
}