"use client";
import { useState } from "react";
import SearchComponent from "@/components/SearchBar";
import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from "lucide-react"
import DateRangePicker from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { set } from "date-fns";
import Link from "next/link";
import AdvancedOptionsComponent from "@/components/AdvancedOptions";

const DEFAULT_MIN_PRICE = 0
const DEFAULT_MAX_PRICE = 1000
export default function SearchTab() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [departureLocation, setDepartureLocation] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");
  const [travelers, setTravelers] = useState("");
  const [roundTrip, setRoundTrip] = useState(true);
  const [preferredAirline, setPreferredAirline] = useState("");
  const [minPrice, setMinPrice] = useState<number>(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULT_MAX_PRICE);
  const [nonStopOnly, setNonStopOnly] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <main className="p-50">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Getaway
      </h1>
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
        />

      <Link href="/results">
        <Button className="h-10 px-6 mt-4">
          go to Results page (testing)
        </Button>
      </Link>
      <AdvancedOptionsComponent
        advancedOpen={advancedOpen}
        setAdvancedOpen={setAdvancedOpen}
        preferredAirline={preferredAirline}
        setPreferredAirline={setPreferredAirline}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        nonStopOnly={nonStopOnly}
        setNonStopOnly={setNonStopOnly}

      />
    </main>
  );
}
