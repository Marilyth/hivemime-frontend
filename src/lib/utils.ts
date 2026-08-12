import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApprovalStatus, FilterQueryBase, MemberRole, ValueOperator } from "./Api";
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

export function valueOperatorToInlineString(operator: ValueOperator | string) {
  switch (operator) {
    case ValueOperator.Equals:
      return "=";
    case ValueOperator.Greater:
      return ">";
    case ValueOperator.GreaterEquals:
      return ">=";
    case ValueOperator.Less:
      return "<";
    case ValueOperator.LessEquals:
      return "<=";
    case "Inside":
      return i18n.t("enums:valueOperator.inside");
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

export function normalize(s: string, allowWhitespace: boolean): string {
  if (!s || !s.trim()) return "";

  let result = "";
  let isLastSpace = false;

  for (const c of s.toLowerCase()) {
    if (/[a-z0-9]/.test(c)) {
      result += c;
      isLastSpace = false;
    } else if (/\s/.test(c) && allowWhitespace && !isLastSpace) {
      result += " ";
      isLastSpace = true;
    }
  }

  return result.trim();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      URL.revokeObjectURL(url);
    };

    img.onerror = reject;
    img.src = url;
  });
}

export function lowerBound<T>(arr: T[], target: T, compare: (a: T, b: T) => number) {
  let lo = 0;
  let hi = arr.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;

    if (compare(arr[mid], target) < 0) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return lo;
}
