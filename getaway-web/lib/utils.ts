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

export const parseDurationToMinutes = (dur: string): number => {
  const hours = parseInt(dur.match(/(\d+)h/)?.[1] || "0");
  const mins = parseInt(dur.match(/(\d+)m/)?.[1] || "0");
  return (hours * 60) + mins;
};

export const formatMinutesToDuration = (totalMinutes: number): string => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};