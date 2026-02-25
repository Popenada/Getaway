"use client";
import { useState } from "react";
import SearchComponent from "@/components/SearchBar";
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, Search } from "lucide-react"
import DateRangePicker from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { set } from "date-fns";
import Link from "next/link";
import AdvancedOptionsComponent from "@/components/AdvancedOptions";
import { SearchHistoryEntry } from "@/lib/types";
import { SearchHistoryPanel } from "@/components/SearchHistoryPanel";
import { useSearchHistory } from "@/hooks/SearchHistory";
const DEFAULT_MIN_PRICE = 0
const DEFAULT_MAX_PRICE = 1000
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
  const {history, addEntry, clearHistory} = useSearchHistory();
  const [departureWindow, setDepartureWindow] = useState<number>(0);
  const [returnWindow, setReturnWindow] = useState<number>(0);
  const [includedAirline, setIncludedAirline] = useState<string[]>([]);
  const [excludedAirline, setExcludedAirline] = useState<string[]>([]);
  const [tripLength, setTripLength] = useState<number>(1);

   const handleSearchAgain = (query: SearchHistoryEntry["query"]) => {
    setDepartureLocation(query.origin);
    setArrivalLocation(query.destination);
    setTravelers(String(query.passengers));
  };

  return (
    <main className="p-50">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Getaway
      </h1>
      <div className="max-w-5xl mx-auto flex gap-8 items-start">
        <div className="flex-1">
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

        <div className="w-80">
        <SearchHistoryPanel
          history={history}
          onSearchAgain={handleSearchAgain}
          ClearHistory={clearHistory}
        />
        
        </div>
        <Button onClick={() => addEntry({
          query: { origin: "JFK", destination: "LAX", departureDate: "2025-06-15", passengers: 2 },
          resultCount: 8
          })}>
          Add fake history entry
        </Button>
      </div>
      
        
    </main>
  );
}
