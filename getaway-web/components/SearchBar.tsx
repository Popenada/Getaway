"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import DateRangePicker from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  dateRange: DateRange | undefined;
  setDateRange: (r: DateRange | undefined) => void;
  departureLocation: string;
  setDepartureLocation: (t: string) => void;
  arrivalLocation: string;
  setArrivalLocation: (t: string) => void;
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

export default function SearchComponent({
  dateRange,
  setDateRange,
  departureLocation,
  setDepartureLocation,
  arrivalLocation,
  setArrivalLocation,
  travelers,
  setTravelers,
  roundTrip,
  includedAirline,
  excludedAirline,
  nonstopOnly,
  minPrice,
  maxPrice,
}: SearchBarProps) {
  const [departureSuggestions, setDepartureSuggestions] = useState<any[]>([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState<any[]>([]);
  const departureTimeout = useRef<NodeJS.Timeout | null>(null);
  const arrivalTimeout = useRef<NodeJS.Timeout | null>(null);
  const [departureCode, setDepartureCode] = useState<string[]>([]);
  const [arrivalCode, setArrivalCode] = useState<string[]>([]);

  const router = useRouter();

  const fetchLocations = async (query: string) => {
    const res = await fetch(`/api/locations?query=${query}`);
    return await res.json();
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      departureCodes: [departureCode].join(","),
      arrivalCodes: [arrivalCode].join(","),
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
    <div className="flex gap-2 items-stretch w-full">

      <div className="relative flex-1">
        <FieldWrapper label="From">
          <Input
            value={departureLocation}
            onChange={async (e) => {
              const value = e.target.value;
              setDepartureLocation(value);
              if (departureTimeout.current) clearTimeout(departureTimeout.current);
              if (value.length < 2) { setDepartureSuggestions([]); return; }
              departureTimeout.current = setTimeout(async () => {
                setDepartureSuggestions(await fetchLocations(value));
              }, 300);
            }}
            placeholder="City or airport"
            onBlur={() => setTimeout(() => setDepartureSuggestions([]), 150)}
            className="border-0 bg-transparent p-0 h-auto text-[15px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
        </FieldWrapper>

        {departureSuggestions.length > 0 && departureLocation.length > 1 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-20 py-1"
            style={{
              background: "#fdfcf9",
              border: "1px solid rgba(26,23,20,0.08)",
              boxShadow: "0 8px 32px rgba(26,23,20,0.12)",
            }}
          >
            {departureSuggestions.map((suggestion, index) => (
              <div
                key={`departure-${index}-${suggestion.label}`}
                className="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 hover:bg-[#f0ede8]"
                onMouseDown={() => {
                  setDepartureLocation(suggestion.label);
                  setDepartureSuggestions([]);
                  setDepartureCode([suggestion.code]);
                }}
              >
                <span className="font-medium" style={{ color: "#1a1714" }}>{suggestion.code}</span>
                <span className="ml-2" style={{ color: "#6b6560" }}>{suggestion.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        title="Swap"
        className="self-center w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 cursor-pointer shrink-0 hover:-translate-y-0.5"
        style={{ background: "#e8e0d4", color: "#6b6560" }}
        onClick={() => {
          const tmpLocation = departureLocation;
          setDepartureLocation(arrivalLocation);
          setArrivalLocation(tmpLocation);
          const tmpCode = departureCode;
          setDepartureCode(arrivalCode);
          setArrivalCode(tmpCode);
        }}
      >
        ⇄
      </button>

      <div className="relative flex-1">
        <FieldWrapper label="To">
          <Input
            value={arrivalLocation}
            onChange={async (e) => {
              const value = e.target.value;
              setArrivalLocation(value);
              if (arrivalTimeout.current) clearTimeout(arrivalTimeout.current);
              if (value.length < 2) { setArrivalSuggestions([]); return; }
              arrivalTimeout.current = setTimeout(async () => {
                setArrivalSuggestions(await fetchLocations(value));
              }, 300);
            }}
            placeholder="City or airport"
            onBlur={() => setTimeout(() => setArrivalSuggestions([]), 150)}
            className="border-0 bg-transparent p-0 h-auto text-[15px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
        </FieldWrapper>

        {arrivalSuggestions.length > 0 && arrivalLocation.length > 1 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-20 py-1"
            style={{
              background: "#fdfcf9",
              border: "1px solid rgba(26,23,20,0.08)",
              boxShadow: "0 8px 32px rgba(26,23,20,0.12)",
            }}
          >
            {arrivalSuggestions.map((suggestion, index) => (
              <div
                key={`arrival-${index}-${suggestion.label}`}
                className="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 hover:bg-[#f0ede8]"
                onMouseDown={() => {
                  setArrivalLocation(suggestion.label);
                  setArrivalSuggestions([]);
                  setArrivalCode([suggestion.code]);
                }}
              >
                <span className="font-medium" style={{ color: "#1a1714" }}>{suggestion.code}</span>
                <span className="ml-2" style={{ color: "#6b6560" }}>{suggestion.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <FieldWrapper label="Dates">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          label="Depart — Return"
        />
      </FieldWrapper>

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
  );
}