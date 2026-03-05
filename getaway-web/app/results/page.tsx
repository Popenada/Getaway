"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


import SortControl, { SortOption } from "@/components/SortControl";
import { FlightAccordion } from "@/components/FlightAccordion";
import { sortData } from "@/lib/sortUtils";
import { Flight } from "@/lib/types"

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cacheKey = `flights-${searchParams.toString()}`;
  const hasFetched = useRef(false);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting states
  const [sortKey, setSortKey] = useState("price_asc"); // tracks sort order

  const fetchFlights = async () => {

    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > 1000 * 60 * 30;

      if (!isExpired) {
        console.log("USING CACHED DATA");
        const cachedData = Array.isArray(parsed.data) ? parsed.data : (Array.isArray(parsed) ? parsed : (parsed.data ?? []));
        setFlights(cachedData);
        setLoading(false);
        return;
      }
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      console.log("FETCHING NEW DATA");
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/flight-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchid: "TEST123",

          departureCodes: searchParams.getAll("departureCodes"),
          arrivalCodes: searchParams.getAll("arrivalCodes"),

          departureDate: searchParams.getAll("departureDate"),
          returnDate: searchParams.getAll("returnDate"),

          travelers: Number(searchParams.get("travelers") || 1),
          tripLength: Number(searchParams.get("tripLength") || 0),
          roundTrip: searchParams.get("roundTrip"),

          includedAirline: searchParams.get("includedAirline")?.split(",").filter(Boolean) ?? [],
          excludedAirline: searchParams.get("excludedAirline")?.split(",").filter(Boolean) ?? [],

          nonstopOnly: searchParams.get("nonstopOnly"),

          minPrice: Number(searchParams.get("minPrice") || 0),
          maxPrice: Number(searchParams.get("maxPrice") || 0),

          departureWindow: Number(searchParams.get("departureWindow") || 0),
          returnWindow: Number(searchParams.get("returnWindow") || 0),
        }),
      });

      if (!res.ok) {
        console.error("Backend error:", await res.text());
        setFlights([]);
        setLoading(false);
        return;
      }

      const data = await res.json();

      console.log("FRONTEND RECEIVED:", data);
      setFlights(data);

      localStorage.setItem(cacheKey, JSON.stringify({
        data: data,
        timestamp: Date.now()
      }));

    } catch (err) {
      console.error("Fetch failed:", err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Searching for flights...</p>
      </main>
    );
  }

  const origin = flights.length > 0 && flights[0].legs.length > 0 ? flights[0].legs[0].origin : '';
  const destination = flights.length > 0 && flights[0].legs.length > 0 ? flights[0].legs[0].destination : '';

  const formattedFlights = flights.map(flight => ({
    ...flight,
    total_departure: flight.legs[0]?.departure_time ?? "",
    total_arrival: flight.legs.at(-1)?.arrival_time ?? "",
  }))

  const sortOptions: SortOption[] = [
    { label: "Price (Lowest)", value: "price_asc" },
    { label: "Price (Highest)", value: "price_dsc" },
    { label: "Date Departure (Earliest)", value: "date_dep_asc" },
    { label: "Date Departure (Latest)", value: "date_dep_dsc" },
    { label: "Date Arrival (Earliest)", value: "date_arr_asc" },
    { label: "Date Arrival (Latest)", value: "date_arr_dsc" },

  ];

  const sortConfig = {
    price_asc: { key: "price", type: "number", order: "asc" },
    price_dsc: { key: "price", type: "number", order: "dsc" },
    date_dep_asc: { key: "date_dep", type: "date", order: "asc" },
    date_dep_dsc: { key: "date_dep", type: "date", order: "dsc" },
    date_arr_asc: { key: "date_arr", type: "date", order: "asc" },
    date_arr_dsc: { key: "date_arr", type: "date", order: "dsc" },
  } as const;

  const activeConfig = sortConfig[sortKey as keyof typeof sortConfig] || sortConfig.price_asc;
  const activeSortField =
    activeConfig.key === "date_dep" ? "total_departure" :
      activeConfig.key === "date_arr" ? "total_arrival" :
        "price";

  const sortedFlights = sortData(
    formattedFlights,
    activeSortField as any,
    activeConfig.type as "number" | "string" | "date",
    activeConfig.order
  )

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="flex items-center text-3xl font-bold text-gray-900 mb-6">
          {origin} {destination && <><ArrowRight className="mx-2 text-gray-400" /> {destination}</>}
        </h1>
        {sortedFlights.length > 0 && (
          <div className="flex gap-4 mb-4">
            <Button
              onClick={fetchFlights}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Retry Search
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              Back to Search
            </Button>
          </div>
        )}
        {sortedFlights.length > 0 && (
          <SortControl
            options={sortOptions}
            value={sortKey}
            onChange={setSortKey}
          />
        )}
        {sortedFlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl bg-white shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                No Flights Found
              </h2>
              <p className="text-gray-500 max-w-md">
                We couldn't find any flights for your selected dates and route.
                Try adjusting your search or retrying.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={fetchFlights}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Retry Search
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/")}
              >
                Back to Search
              </Button>
            </div>
          </div>
        ) : (
          <FlightAccordion flights={sortedFlights} />
        )}
      </div>
    </main>
  );
}