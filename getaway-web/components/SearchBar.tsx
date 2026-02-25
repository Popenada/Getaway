"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/DateRangePicker"
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible } from "@/components/ui/collapsible"
import { useRouter } from "next/navigation";
import { clear } from "console";
import { ArrowRight } from "lucide-react";

type SearchBarProps = {

  dateRange: DateRange | undefined
  setDateRange: (r: DateRange | undefined) => void;

  departureLocations: Array<{ label: string; code: string }>;
  setDepartureLocations: (l: Array<{ label: string; code: string }>) => void;

  arrivalLocations: Array<{ label: string; code: string }>;
  setArrivalLocations: (l: Array<{ label: string; code: string }>) => void;

  travelers: string;
  setTravelers: (t: string) => void;

  roundTrip: boolean;
  setRoundTrip: (v: boolean) => void;

  departureWindow: number;
  returnWindow: number;

  includedAirline: string[];
  excludedAirline: string[];
  nonstopOnly: boolean;

  minPrice: number;
  maxPrice: number;

};

export default function SearchComponent({ dateRange, setDateRange, departureLocations,
  setDepartureLocations, arrivalLocations, setArrivalLocations, travelers, setTravelers,
  roundTrip, setRoundTrip, includedAirline, excludedAirline, nonstopOnly, minPrice, maxPrice
}: SearchBarProps) {

  const [departureInput, setDepartureInput] = useState("");
  const [arrivalInput, setArrivalInput] = useState("");
  
  const [departureSuggestions, setDepartureSuggestions] = useState<any[]>([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState<any[]>([]);

  const departureTimeout = useRef<NodeJS.Timeout | null>(null);
  const arrivalTimeout = useRef<NodeJS.Timeout | null>(null);

  const [departureCode, setDepartureCode] = useState<string[]>([]);
  const [arrivalCode, setArrivalCode] = useState<string[]>([]);

  const router = useRouter();

  const fetchLocations = async (query: string) => {
    const res = await fetch(`/api/locations?query=${query}`);
    const data = await res.json();
    return data;
  }

  const handleSearch = async () => {
    const params = new URLSearchParams({

      departureCodes: departureLocations.map(loc => loc.code).join(","),
      arrivalCodes: arrivalLocations.map(loc => loc.code).join(","),

      departureDate: dateRange?.from
        ? [dateRange.from.toISOString().split('T')[0]].join(",")
        : "",
      returnDate: dateRange?.to
        ? [dateRange.to.toISOString().split('T')[0]].join(",")
        : "",

      travelers: travelers || "1",
      triplength: "",

      roundTrip: String(roundTrip),

      includedAirline: includedAirline.join(","),
      excludedAirline: excludedAirline.join(","),

      nonstopOnly: String(nonstopOnly),

      minPrice: String(minPrice),
      maxPrice: String(maxPrice),

      departureWindow: "0",
      returnWindow: "0",

    });

    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3">

      <div className="flex gap-5 w-200">

        <div className="text-sm font-medium text-black-600 flex-1 relative">
          Departure
          <div className="flex flex-wrap gap-1 border rounded-md p-1 min-h-10 items-center">
            {/* Render selected departure locations */}
            {departureLocations.map((loc, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                {loc.label}
                <button
                  onClick={() => 
                    setDepartureLocations(departureLocations.filter((_, i) => i !== index))
                  }
                  className="hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}

            {/* Input only tracks what's currently being typed */}
            <Input
              className="flex-1 outline-none text-sm min-w-24 px-1"
              value={departureInput}
              onChange={async (e) => {
                const value = e.target.value;
                setDepartureInput(value);

                if (departureTimeout.current) clearTimeout(departureTimeout.current);

                if (value.length < 2) { setDepartureSuggestions([]); return; }

                departureTimeout.current = setTimeout(async () => {
                  const suggestions = await fetchLocations(value);
                  setDepartureSuggestions(suggestions);
                }, 300);
              }}
            
              placeholder={departureLocations.length === 0 ? "Enter departure location" : "Add another..."}
              onBlur={() => setTimeout(() => setDepartureSuggestions([]), 100)}
            />
          </div>

          {departureSuggestions.length > 0 && departureInput.length > 1 && (
            <div className="absolute bg-white border w-full z-10 shadow-md rounded-md">
              {departureSuggestions.map((suggestion, index) => (
                <div
                  key={`departure-${index}-${suggestion.label}`}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (!departureLocations.some(loc => loc.code === suggestion.code)) {
                      setDepartureLocations([...departureLocations, { label: suggestion.label, code: suggestion.code }]);
                    }
                    setDepartureInput("");
                    setDepartureSuggestions([]);
                  }}
                >
                  {suggestion.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <ArrowRight className="mx-2 text-gray-400 mt-6 self-center shrink-0" />

        <div className="text-sm font-medium text-black-600 flex-1 relative">
          Arrival
          <div className="flex flex-wrap gap-1 border rounded-md p-1 min-h-10 items-center">
            {/* Render selected arrival locations */}
            {arrivalLocations.map((loc, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                {loc.label}
                <button
                  onClick={() => 
                    setArrivalLocations(arrivalLocations.filter((_, i) => i !== index))
                  }
                  className="hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}

            {/* Input only tracks what's currently being typed */}
            <Input
              className="flex-1 outline-none text-sm min-w-24 px-1"
              value={arrivalInput}
              onChange={async (e) => {
                const value = e.target.value;
                setArrivalInput(value);

                if (arrivalTimeout.current) clearTimeout(arrivalTimeout.current);

                if (value.length < 2) { setArrivalSuggestions([]); return; }

                arrivalTimeout.current = setTimeout(async () => {
                  const suggestions = await fetchLocations(value);
                  setArrivalSuggestions(suggestions);
                }, 300);
              }}
            
              placeholder={arrivalLocations.length === 0 ? "Enter arrival location" : "Add another..."}
              onBlur={() => setTimeout(() => setArrivalSuggestions([]), 100)}
            />
          </div>

          {arrivalSuggestions.length > 0 && arrivalInput.length > 1 && (
            <div className="absolute bg-white border w-full z-10 shadow-md rounded-md">
              {arrivalSuggestions.map((suggestion, index) => (
                <div
                  key={`arrival-${index}-${suggestion.label}`}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (!arrivalLocations.some(loc => loc.code === suggestion.code)) {
                      setArrivalLocations([...arrivalLocations, { label: suggestion.label, code: suggestion.code }]);
                    }
                    setArrivalInput("");
                    setArrivalSuggestions([]);
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

      <div className="flex items-center gap-5 whitespace-nowrap">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          label="Departure – Return"
        />
        <div className="flex items-center gap-2">
          <Checkbox
            checked={roundTrip}
            onCheckedChange={(checked) => setRoundTrip(!!checked)}

          />
          <p className="text-sm font-medium">Round Trip</p>
        </div>
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