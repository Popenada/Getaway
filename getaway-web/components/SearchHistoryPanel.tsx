"use client";

import { format, parse } from "date-fns";
import type { SearchHistoryEntry } from "@/lib/types";
import { Plane, ArrowRight } from "lucide-react"
type Props = {
  history: SearchHistoryEntry[];
  onSearchAgain: (query: SearchHistoryEntry["query"]) => void;
  ClearHistory: () => void;
};

// Converts "yyyy-MM-dd" string into a readable "MMM d" format e.g. "Jun 15"
function formatDate(date: string) {
  const d = parse(date, "yyyy-MM-dd", new Date());
  return format(d, "MMM d");
}

// Renders a single past search entry as a card with route, date, result count, and a search again button
function HistoryCard({
  entry,
  onSearchAgain,
}: {
  entry: SearchHistoryEntry;
  onSearchAgain: Props["onSearchAgain"];
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl px-4 py-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(253,252,249,0.72)",
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0 2px 16px rgba(26,23,20,0.07)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{ background: "rgba(196,113,74,0.10)", color: "#c4714a" }}
      >
        <Plane size ={16}/>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[14px] font-medium truncate" style={{ color: "#1a1714" }}>
          {entry.query.origin} → {entry.query.destination}
        </span>

        <span className="text-[11px]" style={{ color: "#b8b3ad" }}>
          {entry.query.departureDate ? formatDate(entry.query.departureDate) : ""}
          {entry.resultCount > 0 ? ` · ${entry.resultCount} results` : ""}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onSearchAgain(entry.query)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-200 cursor-pointer"
        style={{ background: "#e8e0d4", color: "#6b6560" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#c4714a";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#e8e0d4";
          e.currentTarget.style.color = "#6b6560";
        }}
        title="Search again"
      >
        <ArrowRight />
      </button>
    </div>
  );
}

// Renders the full history panel — returns null when there are no past searches
export function SearchHistoryPanel({ history, onSearchAgain, ClearHistory }: Props) {
  // Nothing to show if history is empty
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full">

      <div className="flex items-center justify-between mb-1 px-1">
        <span
          className="text-[11px] font-medium tracking-[0.12em] uppercase"
          style={{ color: "#b8b3ad" }}
        >
          Recent Searches
        </span>

        <button
          type="button"
          onClick={ClearHistory}
          className="text-[12px] transition-colors duration-200 cursor-pointer"
          style={{ color: "#b8b3ad" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c4714a")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#b8b3ad")}
        >
          Clear all
        </button>
      </div>

      {history.map((entry) => (
        <HistoryCard key={entry.id} entry={entry} onSearchAgain={onSearchAgain} />
      ))}

    </div>
  );
}