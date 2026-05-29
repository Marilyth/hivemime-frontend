import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ValueOperator } from "./query-builder";
import { ApprovalStatus, MemberRole } from "./Api";
import i18n from "./i18n";

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
      return i18n.t("enums:valueOperator.equals");
    case ValueOperator.Greater:
      return i18n.t("enums:valueOperator.greater");
    case ValueOperator.GreaterEquals:
      return i18n.t("enums:valueOperator.greaterEquals");
    case ValueOperator.Less:
      return i18n.t("enums:valueOperator.less");
    case ValueOperator.LessEquals:
      return i18n.t("enums:valueOperator.lessEquals");
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