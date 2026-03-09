"use client";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import SearchComponent from "@/components/SearchBar";
import AdvancedOptionsComponent from "@/components/AdvancedOptions";
import { SearchHistoryPanel } from "@/components/SearchHistoryPanel";
import { useSearchHistory } from "@/hooks/SearchHistory";
import { SearchHistoryEntry } from "@/lib/types";
import Header from "@/components/Header"
import { set } from "date-fns";
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 10000;

export default function SearchTab() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [departureLocations, setDepartureLocations] = useState<Array<{ label: string; code: string }>>([]);
  const [arrivalLocations, setArrivalLocations] = useState<Array<{ label: string; code: string }>>([]);
  const [travelers, setTravelers] = useState("");
  const [roundTrip, setRoundTrip] = useState(true);
  const [minPrice, setMinPrice] = useState<number>(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULT_MAX_PRICE);
  const [nonstopOnly, setNonStopOnly] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [departureWindow, setDepartureWindow] = useState<number>(0);
  const [returnWindow, setReturnWindow] = useState<number>(0);
  const [includedAirline, setIncludedAirline] = useState<string[]>([]);
  const [excludedAirline, setExcludedAirline] = useState<string[]>([]);
  const [tripLength, setTripLength] = useState<number>(0);

  const { history, addEntry, clearHistory } = useSearchHistory();

  const handleSearchAgain = (query: SearchHistoryEntry["query"]) => {
    setDepartureLocations(query.origins);
    setArrivalLocations(query.destinations);
    setDateRange({
      from: new Date(query.departureDate),
      to: query.returnDate ? new Date(query.returnDate) : undefined,
    });
    setTravelers(String(query.passengers));
    setRoundTrip(Boolean(query.roundTrip));
    setTripLength(query.tripLength || 0);
    setIncludedAirline(query.includedAirline || []);
    setExcludedAirline(query.excludedAirline || []);
    setNonStopOnly(Boolean(query.nonstopOnly));
    setMinPrice(query.minPrice || DEFAULT_MIN_PRICE);
    setMaxPrice(query.maxPrice || DEFAULT_MAX_PRICE);
    setDepartureWindow(query.departureWindow || 0);
    setReturnWindow(query.returnWindow || 0);
  };

  return (
    <div className="getaway-bg relative min-h-screen">
      <div className="relative z-10 flex flex-col min-h-screen">

        <Header/>

        <main className="flex-1 flex flex-col items-center px-10 pt-8 pb-16">

          <p
            className="text-[11px] font-medium tracking-[0.18em] uppercase mb-4 animate-fade-up-1"
            style={{ color: "#c4714a" }}
          >
            Flight Search
          </p>

          <h1
            className="text-center leading-[0.92] mb-4 animate-fade-up-2"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(56px, 9vw, 100px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#1a1714",
            }}
          >
            Find your
            <br />
            <em style={{ color: "#c4714a" }}>escape.</em>
          </h1>

          <p
            className="text-center text-[15px] font-light leading-relaxed max-w-md mb-12 animate-fade-up-3"
            style={{ color: "#6b6560" }}
          >
            Search hundreds of airlines and find the best fares for wherever the world takes you.
          </p>

          <div
            className="w-full max-w-5xl rounded-3xl p-7 mb-4 animate-fade-up-4"
            style={{
              background: "rgba(253,252,249,0.75)",
              border: "1px solid rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 4px 40px rgba(26,23,20,0.10)",
            }}
          >
            <div
              className="flex gap-1 rounded-full p-0.5 w-fit mb-5"
              style={{ background: "#e8e0d4" }}
            >
              {["Round trip", "One way"].map((type) => (
                <button
                  key={type}
                  onClick={() => setRoundTrip(type === "Round trip")}
                  className="text-[12px] font-medium px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                  style={
                    (type === "Round trip") === roundTrip || (type === "One way") === !roundTrip
                      ? { background: "white", color: "#1a1714", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }
                      : { color: "#6b6560" }
                  }
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-stretch">
              <SearchComponent
                departureLocations={departureLocations}
                setDepartureLocations={setDepartureLocations}
                arrivalLocations={arrivalLocations}
                setArrivalLocations={setArrivalLocations}
                dateRange={dateRange}
                setDateRange={setDateRange}
                travelers={travelers}
                setTravelers={setTravelers}
                roundTrip={roundTrip}
                setRoundTrip={setRoundTrip}
                departureWindow={departureWindow}
                returnWindow={returnWindow}
                includedAirline={includedAirline}
                excludedAirline={excludedAirline}
                nonstopOnly={nonstopOnly}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />

            </div>

            <div className="mt-3">
              <AdvancedOptionsComponent
                advancedOpen={advancedOpen}
                setAdvancedOpen={setAdvancedOpen}
                includedAirline={includedAirline}
                setIncludedAirline={setIncludedAirline}
                excludedAirline={excludedAirline}
                setExcludedAirline={setExcludedAirline}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                nonstopOnly={nonstopOnly}
                setNonstopOnly={setNonStopOnly}
                tripLength={tripLength}
                setTripLength={setTripLength}
                departureWindow={departureWindow}
                setDepartureWindow={setDepartureWindow}
                returnWindow={returnWindow}
                setReturnWindow={setReturnWindow}
              />
            </div>
          </div>

          <div className="w-full max-w-2xl animate-fade-up-5">
            <SearchHistoryPanel
              history={history}
              onSearchAgain={handleSearchAgain}
              ClearHistory={clearHistory}
            />
          </div>

        </main>
      </div>
    </div>
  );
}