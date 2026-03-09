import type { SearchHistoryEntry } from "@/lib/types"
import { useState, useEffect } from "react"
const STORAGE_KEY = 'getaway_search_history'

// function react hook to store previous flight searches into table
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([
    // Testing, populating history table
    /*{
      id: "1",
      timestamp: Date.now(),
      query: {
        origins: [{ label: "John F. Kennedy (JFK)", code: "JFK" }],
        destinations: [{ label: "Los Angeles (LAX)", code: "LAX" }],
        departureDate: "2025-06-16",
        passengers: 2,
      },
      resultCount: 12,
    },
    {
      id: "2",
      timestamp: Date.now(),
      query: {
        origins: [{ label: "O'Hare (ORD)", code: "ORD" }],
        destinations: [{ label: "Miami (MIA)", code: "MIA" }],
        departureDate: "2025-07-01",
        passengers: 1,
      },
      resultCount: 5,
    },*/
  ]);

  // Checks if there if localStorage has any items to be stored, if there is parse into JSON file
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  // adds entry function that ommits id and timestamp for ui 
  // newEntry creates newEntry whenever addEntry function is called
  // const variable updated limites entries to 10 entries 
  const addEntry = (entry: Omit<SearchHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry = { ...entry, id: crypto.randomUUID(), timestamp: Date.now() };
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Makes dependency array history back to original state
  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([]);
  }

  return { history, addEntry, clearHistory };

}