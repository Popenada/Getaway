"use client";
import { useState } from "react";
import SearchComponent from "@/components/SearchBar";
import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from "lucide-react"
import DateRangePicker from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { set } from "date-fns";
import Link from "next/link";
export default function SearchTab() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [departureLocation, setDepartureLocation] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");
  const [travelers, setTravelers] = useState("");

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
        />

      <Link href="/results">
        <Button className="h-10 px-6 mt-4">
          go to Results page (testing)
        </Button>
      </Link>
    </main>
  );
}
