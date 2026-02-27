"use client";

import { Button } from "@/components/ui/button"
import { format, parse } from "date-fns"
import type { SearchHistoryEntry } from "@/lib/types"

type Props = {
    history: SearchHistoryEntry[]
    onSearchAgain: (query: SearchHistoryEntry["query"]) => void
    ClearHistory: () => void
}   

function formatDate(date: string){
    const d = parse(date, "yyyy-MM-dd", new Date());
    return format(d, "MM d");
}
// Take one entry of history and rendering it
function HistoryCard({ entry, onSearchAgain }: { entry: SearchHistoryEntry, onSearchAgain: Props["onSearchAgain"] }) {
    return (
        <div className="...">
            <span>{entry.query.origin} → {entry.query.destination}</span>
            <span>
             {entry.query.departureDate ? formatDate(entry.query.departureDate) : ""}
            </span>
            <Button onClick={() => onSearchAgain(entry.query)}>Search again</Button>
        </div>
    )
}

// Function to properly format history entries using historyCard function into a history data table ui
export function SearchHistoryPanel({ history, onSearchAgain, ClearHistory}: Props){
    // passing history prop into function and checking length equal 0
    if (history.length == 0){
        return null
    }

    return (
        <div className="...">
            <h2>Recent Searches</h2>
            {history.map(entry => (
                    <HistoryCard key={entry.id} entry={entry} onSearchAgain={onSearchAgain} />
                    )
                )
            }
             <Button variant="ghost" size="sm" onClick={ClearHistory}>Clear</Button>

        </div>
    )
}
