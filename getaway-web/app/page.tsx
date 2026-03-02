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

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 10000;

export default function SearchTab() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [departureLocation, setDepartureLocation] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");
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
  const [tripLength, setTripLength] = useState<number>(1);

  const { history, addEntry, clearHistory } = useSearchHistory();

  const handleSearchAgain = (query: SearchHistoryEntry["query"]) => {
    setDepartureLocation(query.origin);
    setArrivalLocation(query.destination);
    setTravelers(String(query.passengers));
    setDateRange({
      from: new Date(query.departureDate),
      to: query.returnDate ? new Date(query.returnDate) : undefined,
    });
  };

  return (
    <div className="getaway-bg relative min-h-screen">
      <div className="relative z-10 flex flex-col min-h-screen">

        <header className="flex items-center justify-between px-10 py-6 animate-fade-down">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-base"
              style={{ background: "linear-gradient(135deg, #c4714a, #a85a38)" }}
            >
              <svg viewBox="0 0 28 28" width="20" height="20" fill="none">
                <circle cx="14" cy="14" r="12" stroke="white" strokeWidth="1.5" />
                <text
                  x="14" y="19"
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                  fontSize="14"
                  fontWeight="400"
                  fill="white"
                >G</text>
                <circle cx="23" cy="5" r="2.5" fill="white" opacity="0.7" />
              </svg>
            </div>
            <span
              className="text-xl font-semibold tracking-wide"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Getaway
            </span>
          </div>

          <nav
            className="flex gap-1 rounded-full px-1 py-1 backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(26,23,20,0.08)",
            }}
          >
            {["Search", "Trips", "FAQ"].map((item) => (
              <Link
                key={item}
                href={item === "Search" ? "/" : `/${item.toLowerCase()}`}
                className="text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-200"
                style={
                  item === "Search"
                    ? { background: "#1a1714", color: "#fdfcf9" }
                    : { color: "#6b6560" }
                }
              >
                {item}
              </Link>
            ))}
          </nav>
        </header>

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

          {/* Subtitle */}
          <p
            className="text-center text-[15px] font-light leading-relaxed max-w-md mb-12 animate-fade-up-3"
            style={{ color: "#6b6560" }}
          >
            Search hundreds of airlines and find the best fares for wherever the world takes you.
          </p>

          <div
            className="w-full max-w-2xl rounded-3xl p-7 mb-4 animate-fade-up-4"
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
              {["Round trip", "One way", "Multi-city"].map((type) => (
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
                departureLocation={departureLocation}
                setDepartureLocation={setDepartureLocation}
                arrivalLocation={arrivalLocation}
                setArrivalLocation={setArrivalLocation}
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

              <Link href="/results">
                <button
                  className="flex items-center gap-2 px-6 h-full rounded-2xl text-[14px] font-medium text-white tracking-wide transition-all duration-200 cursor-pointer shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #c4714a, #a85a38)",
                    boxShadow: "0 4px 20px rgba(196,113,74,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(196,113,74,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(196,113,74,0.35)";
                  }}
                >
                  <Search size={15} strokeWidth={2.5} />
                  Search
                </button>
              </Link>
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