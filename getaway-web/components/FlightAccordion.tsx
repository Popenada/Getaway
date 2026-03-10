// src/components/FlightAccordion.tsx
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from "next/navigation";

import { PlaneTakeoff, CircleMinus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import SortControl, { SortOption } from "@/components/SortControl";
import { sortData } from "@/lib/sortUtils";
import { Button } from "@/components/ui/button";
import airportsjs from 'airportsjs';
import { formatDuration, parseDurationToMinutes, formatMinutesToDuration} from "@/lib/utils";
import { Flight, Leg } from "@/lib/types"; 

interface FlightAccordionProps {
  flights: Flight[];
  loading: boolean;
}

export function FlightAccordion({ flights, loading }: FlightAccordionProps) {
  // Sorting states
  const [sortKey, setSortKey] = useState("price_asc"); // tracks sort order
  
  const sortOptions: SortOption[] = [
    { label: "Price (Lowest)", value: "price_asc" },
    { label: "Price (Highest)", value: "price_dsc" },
    { label: "Departure (Earliest)", value: "date_dep_asc" },
    { label: "Departure (Latest)", value: "date_dep_dsc" },
    { label: "Arrival (Earliest)", value: "date_arr_asc" },
    { label: "Arrival (Latest)", value: "date_arr_dsc" },
  ];
  
  const router = useRouter();

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
    activeConfig.key === "date_dep" ? "departure_time" :
      activeConfig.key === "date_arr" ? "arrival_time" :
        "price";
  
  const sortedFlights = useMemo(() => {
    console.log("PRESORTING: ", flights)
    if (Array.isArray(flights)) {
      const sortableData = flights.map(f => ({
        ...f,
        departure_time: f.legs[0]?.departure_time || "",
        arrival_time: f.legs[f.legs.length - 1]?.arrival_time || "",
        numericPrice: parseFloat(f.price)
      }));

      // const activeSortField = 
      //   activeConfig.key === "date_dep" ? "departure_time" :
      //   activeConfig.key === "date_arr" ? "arrival_time" : 
      //   "numericPrice";

      return sortData(
        sortableData,
        activeSortField as any,
        activeConfig.type as any,
        activeConfig.order
      );
    }
    return flights;
  }, [flights, activeConfig])

  console.log("Sorted Output:", sortedFlights);

  if (!Array.isArray(flights)) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center space-y-4 bg-white rounded-xl border-2 border-dashed border-gray-200">
      <div className="bg-gray-100 p-4 rounded-full">
        <PlaneTakeoff className="w-8 h-8 text-gray-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">No flights found</h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          We couldn't find any flights for your selected dates and route. Try adjusting your search or retrying.
        </p>
      </div>
      <div className="flex flex-row gap-4">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Reset All Filters
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
        >
          Back to Search
        </Button>
      </div>
    </div>
    )
  } else if (flights.length === 0 && loading) {
    return (
      <div>
        Loading Results
      </div>
    );
  } else {
    return (
      <div>
        <div>
          {flights.length > 0 && (
            <SortControl
              options={sortOptions}
              value={sortKey}
              onChange={setSortKey}
            />
          )}
        </div>
        <div>
          <Accordion type="multiple" className="w-full space-y-2">
            {sortedFlights?.map((flight, idx) => (
              <AccordionItem
                key={"flight-" + idx}
                value={`item-${idx}`}
                className="border rounded-lg bg-white px-4 shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex justify-between items-center w-full">
                    {/* Airline & Cabin */}
                    <div className="flex flex-col items-center gap-1 border-2 border-gray-200 bg-gray-50 rounded-lg p-2 w-32">
                      <span className="font-semibold text-lg text-gray-900">
                        {flight.legs[0]?.airline || "NA"}
                      </span>
                      <span className="text-sm text-gray-500 uppercase">
                        {flight.cabin}
                      </span>
                    </div>

                    {/* Main Summary */}
                    <div className="flex flex-col w-fit p-1 text-right gap-4">
                      <LegNode legs={flight.legs} compact />
                    </div>

                    {/* Price */}
                    <div className="text-right border-2 border-gray-200 rounded-lg bg-gray-50 p-2 w-32">
                      <span className="text-xl font-bold text-green-600">
                        ${parseFloat(flight.price).toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-400">{flight.currency}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-center w-full ">           
                    {/* HOTFIX figure out a way to center with top accordion without padding offset */}
                    <div className="flex flex-col">
                      {flight.booking_url && (
                        <div className="flex justify-center">
                          <a
                            href={flight.booking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 self-start "
                          >
                            <Button variant="outline" className="text-sm">
                              Book on Google Flights
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
      </div>
    
    );
  }

  
}
// compact denotes if all the output should be displayed
function LegNode({ legs, compact }: { legs: Leg[], compact: Boolean }) {
  const displayLegs = useMemo(() => {
    if (!compact) return legs;

    const editedFlights: Leg[] = [];
    let startLeg: Leg | null = null;
    let accumulatedMinutes = 0;

    legs.forEach((currentLeg) => {
      if (!startLeg) {
        startLeg = { ...currentLeg };
        accumulatedMinutes = 0;
      }

      accumulatedMinutes += parseDurationToMinutes(currentLeg.duration);

      if (currentLeg.stops === 0) {
        editedFlights.push({
          ...startLeg,
          destination: currentLeg.destination,
          arrival_time: currentLeg.arrival_time,
          duration: formatMinutesToDuration(accumulatedMinutes),
        });
        startLeg = null;
      }
    });
    return editedFlights;
  }, [legs, compact]);

  return (
    <>
      {displayLegs.map((leg, jdx) => (
        <div key={jdx} className="flex flex-row gap-16 bg-gray-50">
          <FlightNode airport={leg.origin} time={leg.departure_time} compact={false}/>
          <div className="flex flex-col items-center justify-center gap-1 bg-gray ">
            <PlaneTakeoff className="w-4 h-4 text-gray-400 w-26" />
            <span>
              {formatDuration(leg.duration)}
            </span>
            {compact && leg.stops > 0 &&
              <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium flex gap-1.5 items-center">
                <CircleMinus className="w-3.5 h-3.5" />
                {`${leg.stops} Stops`}
              </Badge>
            }
            
          </div>
          <FlightNode airport={leg.destination} time={leg.arrival_time} compact={false}/>
        </div>
      ))}
    </>
  )
}

function FlightNode({ airport, time, compact }: { airport: string; time: string; compact: boolean }) {
  const airportData = airportsjs.lookupByIataCode(airport).city;
  console.log("AIRPORT: ",airportData)
  return (
    <div className={`flex flex-col items-center justify-center gap-1 border-2 border-gray-200 rounded-lg p-2 ${compact ? "w-24" : "w-48"}`}>
      {compact ? 
        <span className="flex flex-row justify-center">
          <div className="font-medium">
            {airport}
          </div>
        </span>
      :
        <span className="flex flex-row justify-center">
          <div className="font-medium">
            {airportData}
          </div>
          <div className="w-2" />
          <div className="text-gray-600">
            {airport}
          </div>
        </span>
      }
      <Badge variant="secondary" className="whitespace-normal rounded-full px-3 py-1 font-medium flex gap-1.5 items-center">
        {new Date(time).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })}
      </Badge>
    </div>
  );
}