import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const ids = new WeakMap();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReferenceId(obj: WeakKey) {
  if (!ids.has(obj))
    ids.set(obj, crypto.randomUUID());

  return ids.get(obj);
}
