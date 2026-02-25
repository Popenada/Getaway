"use client";

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import type { SearchHistoryEntry } from "@/lib/types"

type Props = {
    history: SearchHistoryEntry[]
    onSearchAgain: (query: SearchHistoryEntry["query"]) => void
    ClearHistory: () => void
}   

// Take one entry of history and rendering it
function HistoryCard({ entry, onSearchAgain }: { entry: SearchHistoryEntry, onSearchAgain: Props["onSearchAgain"] }) {
    return (
        <div className="...">
            <span>{entry.query.origin} → {entry.query.destination}</span>
            <span>{format(new Date(entry.query.departureDate), ' MMM d')}</span>
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
