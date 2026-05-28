import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ValueOperator } from "./query-builder";
import { ApprovalStatus, MemberRole } from "./Api";

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

export function levelToHoney(level: number): number {
  return level * level * 20;
}

export function honeyToLevel(honey: number): number {
  return Math.sqrt(honey / 20);
}

export function getRoleRank(role: MemberRole) {
  switch (role) {
    case MemberRole.Creator:
      return 4;
    case MemberRole.Admin:
      return 3;
    case MemberRole.Moderator:
      return 2;
    case MemberRole.Follower:
      return 1;
    case MemberRole.Guest:
      return 0;
  }
}

export function getRoleColor(role: MemberRole) {
  switch (role) {
    case MemberRole.Creator:
      return "text-blue-500";
    case MemberRole.Admin:
      return "text-orange-500";
    case MemberRole.Moderator:
      return "text-green-500";
    case MemberRole.Follower:
      return "text-muted-foreground";
    case MemberRole.Guest:
      return "text-gray-500";
  }
}

export function getEffectiveRole(role: MemberRole | null | undefined, approvalStatus: ApprovalStatus | null | undefined): MemberRole
{
  if (role == null)
    return MemberRole.Guest;

  if (approvalStatus != null && approvalStatus != ApprovalStatus.Approved)
    return MemberRole.Guest;

  return role;
}