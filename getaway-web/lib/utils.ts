import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (isoDuration: string) => {
  return isoDuration
    .replace('PT','')
    .replace('H','h ')
    .replace('M','m')
    .toLowerCase();
} 