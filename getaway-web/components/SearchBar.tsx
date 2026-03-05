"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import DateRangePicker from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type SearchBarProps = {
  dateRange: DateRange | undefined;
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

function FieldWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="flex flex-col flex-1 rounded-2xl px-4 py-3 transition-all duration-200"
      style={{
        background: "#fdfcf9",
        border: `1.5px solid ${focused ? "#c4714a" : "transparent"}`,
        boxShadow: focused ? "0 0 0 3px rgba(196,113,74,0.10)" : "none",
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      <span
        className="text-[10px] font-medium tracking-[0.1em] uppercase mb-1"
        style={{ color: "#b8b3ad" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export default function SearchComponent({ dateRange, setDateRange, departureLocations,
  setDepartureLocations, arrivalLocations, setArrivalLocations, travelers, setTravelers,
  roundTrip, setRoundTrip, includedAirline, excludedAirline, nonstopOnly, minPrice, maxPrice
}: SearchBarProps) {
  const DEBOUNCE_DELAY = 200; 
  const [departureSuggestions, setDepartureSuggestions] = useState<any[]>([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState<any[]>([]);
  const [departureInput, setDepartureInput] = useState("");
  const [arrivalInput, setArrivalInput] = useState("");
  const departureTimeout = useRef<NodeJS.Timeout | null>(null);
  const arrivalTimeout = useRef<NodeJS.Timeout | null>(null);
  const [departureCode, setDepartureCode] = useState<string[]>([]);
  const [arrivalCode, setArrivalCode] = useState<string[]>([]);

  const router = useRouter();

  const clientCache = useRef<Map<string, any[]>>(new Map());

  // autocomplete
  const fetchLocations = async (query: string) => {
    // check if any shorter prefix is cached and filter it
    for (let i = query.length; i >= 2; i--) {
      const prefix = query.slice(0, i);
      if (clientCache.current.has(prefix)) {
        const cached = clientCache.current.get(prefix)!;
        const filtered = cached.filter(s =>
          s.label.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase())
        );
        if (filtered.length > 0) return filtered;
        break; // cached prefix returned nothing useful, fall through to API
      }
    }

    if (clientCache.current.has(query)) return clientCache.current.get(query)!;

    const res = await fetch(`/api/locations?query=${query}`);
    const data = await res.json();
    clientCache.current.set(query, data);
    return data;
  }

  const handleSearch = () => {
    const params = new URLSearchParams({

      departureCodes: departureLocations.map(loc => loc.code).join(","),
      arrivalCodes: arrivalLocations.map(loc => loc.code).join(","),

      departureDate: dateRange?.from
        ? dateRange.from.toISOString().split("T")[0]
        : "",
      returnDate: dateRange?.to
        ? dateRange.to.toISOString().split("T")[0]
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
  };

  return (
  <div className="flex flex-col gap-3 w-full">
    {/* Row 1: From / Swap / To */}
    <div className="flex gap-2 items-stretch w-full">
      {/* FROM */}
      <div className="relative flex-1">
        <FieldWrapper label="From">
          <div className="flex flex-wrap gap-1 items-center">
            {departureLocations.map((loc, index) => (
              <span
                key={`${loc.code}-${index}`}
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: "#e8e0d4", color: "#1a1714" }}
              >
                <span className="font-medium">{loc.code}</span>
                <span className="opacity-80">{loc.label}</span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    setDepartureLocations(
                      departureLocations.filter((_, i) => i !== index)
                    )
                  }
                  className="ml-1 font-bold opacity-60 hover:opacity-100"
                  aria-label="Remove departure"
                >
                  ×
                </button>
              </span>
            ))}

            <Input
              value={departureInput}
              onChange={(e) => {
                const value = e.target.value;
                setDepartureInput(value);

                if (departureTimeout.current) clearTimeout(departureTimeout.current);
                if (value.length < 2) {
                  setDepartureSuggestions([]);
                  return;
                }

                departureTimeout.current = setTimeout(async () => {
                  setDepartureSuggestions(await fetchLocations(value));
                }, DEBOUNCE_DELAY);
              }}
              placeholder={
                departureLocations.length === 0 ? "City or airport" : "Add another..."
              }
              onBlur={() => setTimeout(() => setDepartureSuggestions([]), 150)}
              className="border-0 bg-transparent p-0 h-auto text-[15px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-[120px]"
            />
          </div>
        </FieldWrapper>

        {departureSuggestions.length > 0 && departureInput.length > 1 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-y-auto max-h-40 z-[120] py-1"
            style={{
              background: "#fdfcf9",
              border: "1px solid rgba(26,23,20,0.08)",
              boxShadow: "0 8px 32px rgba(26,23,20,0.12)",
            }}
          >
            {departureSuggestions.map((suggestion, index) => (
              <div
                key={`departure-${index}-${suggestion.code}`}
                className="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 hover:bg-[#f0ede8]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (!departureLocations.some((loc) => loc.code === suggestion.code)) {
                    setDepartureLocations([
                      ...departureLocations,
                      { label: suggestion.label, code: suggestion.code },
                    ]);
                  }
                  setDepartureInput("");
                  setDepartureSuggestions([]);
                }}
              >
                <span className="font-medium" style={{ color: "#1a1714" }}>
                  {suggestion.code}
                </span>
                <span className="ml-2" style={{ color: "#6b6560" }}>
                  {suggestion.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SWAP */}
      <button
        type="button"
        title="Swap"
        className="self-center w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 cursor-pointer shrink-0 hover:-translate-y-0.5"
        style={{ background: "#e8e0d4", color: "#6b6560" }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const tmp = departureLocations;
          setDepartureLocations(arrivalLocations);
          setArrivalLocations(tmp);

          const tmpInput = departureInput;
          setDepartureInput(arrivalInput);
          setArrivalInput(tmpInput);

          setDepartureSuggestions([]);
          setArrivalSuggestions([]);
        }}
      >
        ⇄
      </button>

      {/* TO */}
      <div className="relative flex-1">
        <FieldWrapper label="To">
          <div className="flex flex-wrap gap-1 items-center">
            {arrivalLocations.map((loc, index) => (
              <span
                key={`${loc.code}-${index}`}
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: "#e8e0d4", color: "#1a1714" }}
              >
                <span className="font-medium">{loc.code}</span>
                <span className="opacity-80">{loc.label}</span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    setArrivalLocations(arrivalLocations.filter((_, i) => i !== index))
                  }
                  className="ml-1 font-bold opacity-60 hover:opacity-100"
                  aria-label="Remove arrival"
                >
                  ×
                </button>
              </span>
            ))}

            <Input
              value={arrivalInput}
              onChange={(e) => {
                const value = e.target.value;
                setArrivalInput(value);

                if (arrivalTimeout.current) clearTimeout(arrivalTimeout.current);
                if (value.length < 2) {
                  setArrivalSuggestions([]);
                  return;
                }

                arrivalTimeout.current = setTimeout(async () => {
                  setArrivalSuggestions(await fetchLocations(value));
                }, DEBOUNCE_DELAY);
              }}
              placeholder={arrivalLocations.length === 0 ? "City or airport" : "Add another..."}
              onBlur={() => setTimeout(() => setArrivalSuggestions([]), 150)}
              className="border-0 bg-transparent p-0 h-auto text-[15px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-[120px]"
            />
          </div>
        </FieldWrapper>

        {arrivalSuggestions.length > 0 && arrivalInput.length > 1 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-y-auto max-h-40 z-[120] py-1"
            style={{
              background: "#fdfcf9",
              border: "1px solid rgba(26,23,20,0.08)",
              boxShadow: "0 8px 32px rgba(26,23,20,0.12)",
            }}
          >
            {arrivalSuggestions.map((suggestion, index) => (
              <div
                key={`arrival-${index}-${suggestion.code}`}
                className="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 hover:bg-[#f0ede8]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (!arrivalLocations.some((loc) => loc.code === suggestion.code)) {
                    setArrivalLocations([
                      ...arrivalLocations,
                      { label: suggestion.label, code: suggestion.code },
                    ]);
                  }
                  setArrivalInput("");
                  setArrivalSuggestions([]);
                }}
              >
                <span className="font-medium" style={{ color: "#1a1714" }}>
                  {suggestion.code}
                </span>
                <span className="ml-2" style={{ color: "#6b6560" }}>
                  {suggestion.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Row 2: Dates / Travelers / Search */}
    <div className="flex gap-2 items-stretch w-full">
      <div className="flex-1">
        <FieldWrapper label="Dates">
          <DateRangePicker value={dateRange} onChange={setDateRange} label="Depart — Return" />
        </FieldWrapper>
      </div>

      <div className="w-[120px] shrink-0">
        <FieldWrapper label="Travelers">
          <Input
            type="number"
            min={1}
            max={8}
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            placeholder="1"
            className="border-0 bg-transparent p-0 h-auto text-[15px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none w-16"
          />
        </FieldWrapper>
      </div>

      <button
        type="button"
        onClick={handleSearch}
        className="flex items-center gap-2 px-6 rounded-2xl text-sm font-medium text-white shrink-0 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #c4714a, #a85a38)",
          boxShadow: "0 4px 20px rgba(196,113,74,0.35)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(196,113,74,0.45)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(196,113,74,0.35)";
        }}
      >
        <Search size={15} strokeWidth={2.5} />
        Search
      </button>
    </div>
  </div>
);
}