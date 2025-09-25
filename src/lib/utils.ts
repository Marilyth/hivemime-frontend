import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { makeAutoObservable } from "mobx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fluently makes an instance of a class observable using MobX.
 * @param instance The interface data to be made observable.
 * @returns The observable instance.
 */
export function createObservable<T extends object>(instance: T): T
{
    makeAutoObservable(instance);
    return instance;
}