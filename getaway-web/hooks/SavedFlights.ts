import {useState, useEffect } from "react"
import {SavedFlightEntry} from "@/lib/types"
const STORAGE_KEY = 'getaway_saved_flights'

export default function useSavedFlights(){
    const [saved, setSaved] = useState<SavedFlightEntry[]>([]);

    // Checking if there are saved flights in JSON file
    useEffect(() => {
     const stored = localStorage.getItem(STORAGE_KEY);
     if (stored) setSaved(JSON.parse(stored));
    }, []);
    
    // Create constant function to save flights for type Flight in JSON file
    const saveFlights = (flight: SavedFlightEntry) => {
        setSaved(prev => {
            const updated = [flight, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated;
        })
    };

    // Create constant function to remove saved flights from JSON file
    const removeFlights = (id: string) => {
        setSaved(prev =>{
            const updated = prev.filter(f => f.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated;
        })
    }

    const isSaved = (id: string) => saved.some(f => f.id === id);

    return {saved, saveFlights, removeFlights, isSaved}
};

