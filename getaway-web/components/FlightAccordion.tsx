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

import { FlightTimeline } from "@/components/FlightTimeline";
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
  const [sortKey, setSortKey] = useState("price_asc");
  const router = useRouter();

  const sortOptions: SortOption[] = [
    { label: "Price (Lowest)", value: "price_asc" },
    { label: "Price (Highest)", value: "price_dsc" },
    { label: "Departure (Earliest)", value: "date_dep_asc" },
    { label: "Departure (Latest)", value: "date_dep_dsc" },
    { label: "Arrival (Earliest)", value: "date_arr_asc" },
    { label: "Arrival (Latest)", value: "date_arr_dsc" },
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
  const activeSortField = activeConfig.key === "date_dep" ? "departure_time" : activeConfig.key === "date_arr" ? "arrival_time" : "price";

  const sortedFlights = useMemo(() => {
    if (Array.isArray(flights)) {
      const sortableData = flights.map(f => ({
        ...f,
        departure_time: f.legs[0]?.departure_time || "",
        arrival_time: f.legs[f.legs.length - 1]?.arrival_time || "",
        numericPrice: parseFloat(f.price)
      }));
      return sortData(sortableData, activeSortField as any, activeConfig.type as any, activeConfig.order);
    }
    return flights;
  }, [flights, activeConfig, activeSortField]);

  if (!Array.isArray(flights)) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center space-y-4 rounded-3xl border border-white/40" 
        style={{ background: "rgba(253,252,249,0.5)", backdropFilter: "blur(20px)" }}>
        <div className="bg-white/80 p-4 rounded-full shadow-sm">
          <PlaneTakeoff className="w-8 h-8" style={{ color: "#c4714a" }} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold" style={{ color: "#1a1714" }}>No flights found</h3>
          <p style={{ color: "#6b6560" }} className="max-w-xs mx-auto">
            Try adjusting your search or retrying.
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <Button variant="outline" className="rounded-full bg-white/50" onClick={() => window.location.reload()}>Reset All Filters</Button>
          <Button variant="outline" className="rounded-full bg-white/50" onClick={() => router.push("/")}>Back to Search</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full rounded-3xl p-7 animate-fade-up-4"
      style={{
        background: "rgba(253,252,249,0.75)",
        border: "1px solid rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 40px rgba(26,23,20,0.10)",
      }}
    >
    <div className="space-y-4">
      {flights.length > 0 && <SortControl options={sortOptions} value={sortKey} onChange={setSortKey} />}
      <Accordion type="multiple" className="w-full space-y-3">
        {sortedFlights?.map((flight, idx) => (
          <AccordionItem
            key={"flight-" + idx}
            value={`item-${idx}`}
            className="border-none rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl"
            style={{ 
              background: "rgba(255, 255, 255, 0.75)", 
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(255, 255, 255, 0.8)"
            }}
          >
            <AccordionTrigger className="hover:no-underline px-6 py-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col items-center gap-1 border border-gray-200/30 bg-white/50 rounded-xl p-3 w-36 shadow-sm">
                  <span className="font-bold text-lg" style={{ color: "#1a1714" }}>{flight.legs[0]?.airline || "NA"}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{flight.cabin}</span>
                </div>

                <div className="flex flex-col w-fit">
                  <LegNode legs={flight.legs} compact />
                </div>

                <div className="text-right border border-gray-200/30 rounded-xl bg-white/50 p-3 w-32 shadow-sm">
                  <span className="text-xl font-bold" style={{ color: "#c4714a" }}>
                    ${parseFloat(flight.price).toFixed(2)}
                  </span>
                  <p className="text-[10px] uppercase font-bold opacity-40">{flight.currency}</p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 pb-6 pt-2" style={{ background: "rgba(253, 252, 249, 0.3)" }}>
              <div className="space-y-8">
                <FlightTimeline 
                  label="Departure" 
                  legs={flight.legs.filter(leg => leg.stops === 0 || flight.legs.indexOf(leg) < flight.legs.length / 2)} 
                />
                <FlightTimeline 
                  label="Return" 
                  legs={flight.legs.filter(leg => flight.legs.indexOf(leg) >= flight.legs.length / 2)} 
                />
                {flight.booking_url && (
                  <div className="pt-6 flex justify-center border-t border-gray-200/30">
                    <a
                      href={flight.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 self-start"
                    >
                      <Button 
                      className="w-48 rounded-full shadow-md transition-all hover:scale-105"
                      style={{ background: "#c4714a", color: "white" }}
                    >
                      Book This Trip
                    </Button>
                    </a>
                    
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    </div>
  );
}

function LegNode({ legs, compact }: { legs: Leg[], compact: Boolean }) {
  const displayLegs = useMemo(() => {
    if (!compact) return legs;
    const editedFlights: Leg[] = [];
    let startLeg: Leg | null = null;
    let accumulatedMinutes = 0;

    legs.forEach((currentLeg) => {
      if (!startLeg) { startLeg = { ...currentLeg }; accumulatedMinutes = 0; }
      accumulatedMinutes += parseDurationToMinutes(currentLeg.duration);
      if (currentLeg.stops === 0) {
        editedFlights.push({ ...startLeg, destination: currentLeg.destination, arrival_time: currentLeg.arrival_time, duration: formatMinutesToDuration(accumulatedMinutes) });
        startLeg = null;
      }
    });
    return editedFlights;
  }, [legs, compact]);

  return (
    <div className="space-y-4">
      {displayLegs.map((leg, jdx) => (
        <div key={jdx} className="flex flex-row items-center gap-12 px-4 py-1.5 rounded-xl bg-white/30">
          <FlightNode airport={leg.origin} time={leg.departure_time} compact={false}/>
          <div className="flex flex-col items-center justify-center gap-1 min-w-[140px]">
            <PlaneTakeoff className="w-4 h-4 opacity-30" />
            <span className="text-[11px] font-medium" style={{ color: "#6b6560" }}>{formatDuration(leg.duration)}</span>
            {compact && leg.stops > 0 &&
              <Badge variant="outline" className="rounded-full bg-white/60 border-gray-200/50 text-[10px] px-2 py-0" style={{ color: "#6b6560" }}>
                <CircleMinus className="w-3 h-3 mr-1" style={{ color: "#c4714a" }} />
                {`${leg.stops} Stops`}
              </Badge>
            }
          </div>
          <FlightNode airport={leg.destination} time={leg.arrival_time} compact={false}/>
        </div>
      ))}
    </div>
  );
}

function FlightNode({ airport, time, compact }: { airport: string; time: string; compact: boolean }) {
  const airportData = airportsjs.lookupByIataCode(airport).city;
  return (
    <div className={`flex flex-col items-center justify-center gap-0.5 ${compact ? "w-20" : "w-40"}`}>
      <span className="flex flex-row justify-center items-baseline gap-1.5">
        <div className="font-semibold text-sm" style={{ color: "#1a1714" }}>{airportData}</div>
        <div className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">{airport}</div>
      </span>
      <span className="text-[10px] font-medium opacity-60" style={{ color: "#6b6560" }}>
        {new Date(time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
      </span>
    </div>
  );
}