"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DateGrid from "@/components/DateGrid";
import SortControl, { SortOption } from "@/components/SortControl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { sortData } from "@/lib/sortUtils";
import { Leg, Flight } from "@/lib/types";
import { useSearchHistory } from "@/hooks/SearchHistory";
import { de, tr } from "date-fns/locale";

const CACHE_DURATION = 30 * 60 * 1000; // in milliseconds (30 minutes)

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cacheKey = `flights-${searchParams.toString()}`;
  const hasFetched = useRef(false);
  const { addEntry } = useSearchHistory();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  //const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Sorting states
  const [sortKey, setSortKey] = useState("price_asc"); // tracks sort order
  
  const fetchFlights = async () => {
    // check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;

      if (!isExpired) {
        console.log("USING CACHED DATA");
        const cachedData = Array.isArray(parsed.data) ? parsed.data : (Array.isArray(parsed) ? parsed : (parsed.data ?? []));
        setFlights(cachedData);
        setLoading(false);
        return;
      }
    }

    // check if we already fetched new data for this query in this session to avoid duplicate calls
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    try {
      console.log("FETCHING NEW DATA");
      setLoading(true);

      const departureLabels = searchParams.get("departureLabels")?.split("|").filter(Boolean) ?? [];
      const arrivalLabels = searchParams.get("arrivalLabels")?.split("|").filter(Boolean) ?? [];
      const departureCodes = searchParams.get("departureCodes")?.split(",").filter(Boolean) ?? [];
      const arrivalCodes = searchParams.get("arrivalCodes")?.split(",").filter(Boolean) ?? [];
      const departureDate = searchParams.get("departureDate")?.split(",").filter(Boolean) ?? [];
      const returnDate = searchParams.get("returnDate")?.split(",").filter(Boolean) ?? [];
      const travelers = Number(searchParams.get("travelers") || 1);
      const tripLength = Number(searchParams.get("tripLength") || 0);
      const roundTrip = searchParams.get("roundTrip") === "true";
      const includedAirlineCodes = searchParams.get("includedAirlines")?.split(",").filter(Boolean) ?? [];
      const excludedAirlineCodes = searchParams.get("excludedAirlines")?.split(",").filter(Boolean) ?? [];
      const includedAirlineNames = searchParams.get("includedAirlineNames")?.split("|").filter(Boolean) ?? [];
      const excludedAirlineNames = searchParams.get("excludedAirlineNames")?.split("|").filter(Boolean) ?? [];
      const includedAirlineLogos = searchParams.get("includedAirlineLogos")?.split("|").filter(Boolean) ?? [];
      const excludedAirlineLogos = searchParams.get("excludedAirlineLogos")?.split("|").filter(Boolean) ?? [];
      const nonstopOnly = searchParams.get("nonstopOnly") === "true";
      const minPrice = Number(searchParams.get("minPrice") || 0);
      const maxPrice = Number(searchParams.get("maxPrice") || 0);
      const departureWindow = Number(searchParams.get("departureWindow") || 0);
      const returnWindow = Number(searchParams.get("returnWindow") || 0);

      const res = await fetch("http://localhost:5000/api/flight-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchid: "TEST123",

          departureCodes: departureCodes,
          arrivalCodes: arrivalCodes,
          departureDate: departureDate,
          returnDate: returnDate,
          travelers: travelers,
          tripLength: tripLength,
          roundTrip: String(roundTrip),
          includedAirline: includedAirlineCodes,
          excludedAirline: excludedAirlineCodes,
          nonstopOnly: String(nonstopOnly),
          minPrice: minPrice,
          maxPrice: maxPrice,
          departureWindow: departureWindow,
          returnWindow: returnWindow,
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

      const originsForEntry = departureCodes.map((code, idx) => ({ code, label: departureLabels[idx] ?? code }));
      const destinationsForEntry = arrivalCodes.map((code, idx) => ({ code, label: arrivalLabels[idx] ?? code }));
      const includedAirlinesForEntry = includedAirlineCodes.map((code, idx) => ({ code, label: includedAirlineNames[idx] ?? code, logo: includedAirlineLogos[idx] ?? "" }));
      const excludedAirlinesForEntry = excludedAirlineCodes.map((code, idx) => ({ code, label: excludedAirlineNames[idx] ?? code, logo: excludedAirlineLogos[idx] ?? "" }));

      addEntry({
        query: {
          origins: originsForEntry,
          destinations: destinationsForEntry,
          departureDate: searchParams.get("departureDate") ?? "",
          returnDate: searchParams.get("returnDate") ?? "",
          passengers: travelers,
          roundTrip,
          tripLength,
          includedAirlines: includedAirlinesForEntry,
          excludedAirlines: excludedAirlinesForEntry,
          nonstopOnly,
          minPrice,
          maxPrice,
          departureWindow,
          returnWindow,
        },
        resultCount: Array.isArray(data) ? data.length : 0,
      })
      
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

  const origin = searchParams.get("departureCodes")?.split(",").filter(Boolean) ?? []; //flights.length > 0 && flights[0].legs.length > 0 ? flights[0].legs[0].origin : '';
	const destination = searchParams.get("arrivalCodes")?.split(",").filter(Boolean) ?? []; //flights.length > 0 && flights[0].legs.length > 0 ? flights[0].legs[0].destination : '';

  const formattedFlights = flights.map(flight => ({
    ...flight,
    total_departure: flight.legs[0]?.departure_time ?? "",
    total_arrival: flight.legs.at(-1)?.arrival_time ?? "",
  }))

  const formatDuration = (isoDuration: string) => {
    return isoDuration
      .replace('PT','')
      .replace('H',' hr ')
      .replace('M',' min')
      .toLowerCase();
  }
  
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
          {origin.join(", ") || "Flight Search"}
          {destination.length > 0 && <><ArrowRight className="mx-2 text-gray-400" />{destination.join(", ")}</>}
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
          <Accordion type="single" collapsible className="w-full space-y-4">
          {sortedFlights.map((flight, idx) => (
            <AccordionItem
              key={"flight-"+idx}
              value={`item-${idx}`}
              className="border rounded-lg bg-white px-4 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold text-lg text-gray-900">
                      {flight.legs[0]?.airline || "NA"}
                    </span>
                    <span className="text-sm text-gray-500 uppercase">
                      {flight.cabin}
                    </span>
                  </div>
                  <div className="flex items-center w-fit border-2 border-gray-200 rounded-lg p-1 bg-gray-50 text-right">
                    {flight.legs.length > 0 ? 
                    <span className="flex items-center gap-1">
                      {new Date(flight.total_departure).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      {flight.legs.length > 2 ?
                        <div className="flex items-center w-fit border-2 border-gray-200 rounded-lg p-1 bg-gray-200">
                          {flight.legs.length - 2} stops
                        </div> :
                        <ArrowRight className="w-4 h-4"/>
                      }
                      {new Date(flight.total_arrival).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span> : 
                    <span>No Dates Found</span>
                    }
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-600">
                      ${parseFloat(flight.price).toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-400">{flight.currency}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 p-1">
                  {flight.legs.map((leg, jdx) => (
                    <div key={"leg-"+idx+"-"+jdx} className="w-fit border-2 border-gray-200 rounded-lg p-1 bg-gray-50">
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <span className="font-semibold">{leg.origin}</span>
                        <span>{new Date(leg.departure_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="font-semibold">{leg.destination}</span>
                        <span>{new Date(leg.arrival_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                        <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-sm font-normal">
                          {formatDuration(leg.duration)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* booking link button, this is temporary, if it conflicts, just remove it */}
                  {flight.booking_url && (
                    <a
                      href={flight.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 self-start"
                    >
                      <Button variant="outline" className="text-sm">
                        Book on Google Flights
                      </Button>
                  </a>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          </Accordion>
        )}
      </div>
    </main>
  );
}