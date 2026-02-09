"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/DateRangePicker"
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

type SearchBarProps = {
    dateRange: DateRange | undefined
    setDateRange: (r: DateRange | undefined) => void;

    departureLocation: string;
    setDepartureLocation: (t: string) => void;

    arrivalLocation: string;
    setArrivalLocation: (t: string) => void;

    travelers: string;
    setTravelers: (t: string) => void;
};

export default function SearchComponent({dateRange, setDateRange, departureLocation, 
    setDepartureLocation, arrivalLocation, setArrivalLocation, travelers, setTravelers
}: SearchBarProps) {
    const [departureSuggestions, setDepartureSuggestions] = useState<any[]>([]);
    const [arrivalSuggestions, setArrivalSuggestions] = useState<any[]>([]);

    const [departureCode, setDepartureCode] = useState("");
    const [arrivalCode, setArrivalCode] = useState("");

    const router = useRouter();

    const fetchLocations = async (query: string) => {
        const res = await fetch(`/api/locations?query=${query}`);
        const data = await res.json();
        return data;
    }

    const handleSearch = async () => {
        const params = new URLSearchParams({
            origin: departureCode,
            destination: arrivalCode,
            departure: dateRange?.from ? dateRange.from.toISOString().split('T')[0] : '',
            return: dateRange?.to ? dateRange.to.toISOString().split('T')[0] : '',
            adults: travelers,
        });

        router.push(`/results?${params.toString()}`);
    }

    return (
        <div className="flex flex-col gap-3"> 

            <div className="flex gap-5 w-150">

                <div className="text-sm font-medium text-black-600">
                    Departure
                    <Input
                        value={departureLocation}
                        onChange={async (e) => {
                            const value = e.target.value;
                            setDepartureLocation(value);

                            if (value.length < 2) {
                                setDepartureSuggestions([]);
                                return;
                            }

                            const suggestions = await fetchLocations(value);
                            setDepartureSuggestions(suggestions);
                        }}

                        placeholder="Enter departure location"
                        onBlur={() => setTimeout(() => setDepartureSuggestions([]), 100)}
                    />

                    {departureSuggestions.length > 0 && departureLocation.length > 1 && (
                        <div className="absolute bg-white border w-full z-10">
                            {departureSuggestions.map((suggestion, index) => (
                                <div
                                    key={`departure-${index}-${suggestion.label}`}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        setDepartureLocation(suggestion.label);
                                        setDepartureSuggestions([]);
                                        setDepartureCode(suggestion.code);
                                    }}
                                >
                                    {suggestion.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="text-sm font-medium text-black-600">
                    Arrival
                    <Input 
                        value={arrivalLocation}
                        onChange={async (e) => {
                            const value = e.target.value;
                            setArrivalLocation(value);

                            if (value.length < 2) {
                                setArrivalSuggestions([]);
                                return;
                            }

                            const suggestions = await fetchLocations(value);
                            setArrivalSuggestions(suggestions);
                        }}

                        placeholder="Enter arrival location"
                        onBlur={() => setTimeout(() => setArrivalSuggestions([]), 100)}
                    />

                    {arrivalSuggestions.length > 0 && arrivalLocation.length > 1 && (
                        <div className="absolute bg-white border w-full z-10">
                            {arrivalSuggestions.map((suggestion, index) => (
                                <div
                                    key={`arrival-${index}-${suggestion.label}`}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        setArrivalLocation(suggestion.label);
                                        setArrivalSuggestions([]);
                                        setArrivalCode(suggestion.code);
                                    }}
                                >
                                    {suggestion.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <Button onClick={handleSearch} className="h-10 px-6 mt-4">
                    Search
                </Button>
            </div>

            <div className="flex gap-5 w-80">
                <DateRangePicker value={dateRange} onChange={setDateRange} label="Departure – Return" />
            </div>

            <div className="flex gap-5 w-18">
                <Input
                    type="number"
                    min={1}
                    max={8}
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    placeholder="Travelers"
                />
            </div>
        </div>
    );
}
