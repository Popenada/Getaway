"use client";

import { useState, useMemo } from 'react';
import { useRouter } from "next/navigation";

import { 
  PlaneTakeoff, 
  CircleMinus, 
  BookmarkCheck, 
  PlaneLanding,
  Ellipsis,
  RefreshCw 
} from 'lucide-react';
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
import { SaveButton } from "@/components/ui/bookmark"

import airportsjs from 'airportsjs';
import { formatDuration, formatTime } from "@/lib/utils";
import { Flight, ProcessedFlight, Segment } from "@/lib/types";
 
import useSavedFlights from "@/hooks/SavedFlights"
import { MOCK_FLIGHTS } from '@/lib/data/mockData';
import GroupControl, { GroupOption } from './GroupControl';
import { groupData } from '@/lib/groupUtils';


interface FlightAccordionProps {
  flights: Flight[];
  loading: boolean;
  group?: boolean
  mockdata?: boolean
}

export function FlightAccordion({ flights, loading, group = false, mockdata = false }: FlightAccordionProps) {
  const {saved, saveFlights, removeFlights, isSaved } = useSavedFlights();

  const [sortKey, setSortKey] = useState("price_asc");
  const [groupKey, setGroupKey] = useState("price")

  const router = useRouter();

  const sortOptions: SortOption[] = [
    { label: "Price (Lowest)",      value: "price_asc"    },
    { label: "Price (Highest)",     value: "price_dsc"    },
    { label: "Departure (Earliest)",value: "date_dep_asc" },
    { label: "Departure (Latest)",  value: "date_dep_dsc" },
    { label: "Arrival (Earliest)",  value: "date_arr_asc" },
    { label: "Arrival (Latest)",    value: "date_arr_dsc" },
  ];
  const groupOptions: GroupOption[] = [
    { label: "Date", value: "date", classname: "bg-emerald-500/10 text-emerald-700 border-emerald-200/50 hover:bg-emerald-500/20" },
    { label: "Destination", value: "dest", classname: "bg-rose-500/10 text-rose-700 border-rose-200/50 hover:bg-rose-500/20" },
    { label: "Price", value: "price", classname: "bg-sky-500/10 text-sky-700 border-sky-200/50 hover:bg-sky-500/20" },
  ];

  const sortConfig = {
    price_asc:    { key: "price",    type: "number", order: "asc" },
    price_dsc:    { key: "price",    type: "number", order: "dsc" },
    date_dep_asc: { key: "date_dep", type: "date",   order: "asc" },
    date_dep_dsc: { key: "date_dep", type: "date",   order: "dsc" },
    date_arr_asc: { key: "date_arr", type: "date",   order: "asc" },
    date_arr_dsc: { key: "date_arr", type: "date",   order: "dsc" },
  } as const;

  const activeConfig = sortConfig[sortKey as keyof typeof sortConfig] || sortConfig.price_asc;
  const activeSortField = activeConfig.key === "date_dep" ? "departure_time" : activeConfig.key === "date_arr" ? "arrival_time" : "price";
  
  const activeGroupField = groupKey;

  const processedData = useMemo(() => {
    if (Array.isArray(flights)) {
      const sortableData = (mockdata ? MOCK_FLIGHTS : flights).map(f => ({
        ...f,
        departure_time: f.legs[0]?.departure_time || "",
        arrival_time: f.legs[f.legs.length - 1]?.arrival_time || "",
        numericPrice: parseFloat(f.price),
        savedEntry: saved.find((s) =>
          s.legs[0]?.departure_time === f.legs[0]?.departure_time &&
          s.legs[0]?.origin === f.legs[0]?.origin &&
          s.legs[0]?.destination === f.legs[0]?.destination &&
          s.price === f.price
        )
      }));
      return groupData(sortData(sortableData, activeSortField as any, activeConfig.type as any, activeConfig.order), activeGroupField as any);
    }
    return flights;
  }, [flights, activeConfig, activeSortField, saved, activeGroupField]); 
  
  // Handles failed searches 
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
          <Button variant="outline" className="rounded-full bg-white/50" onClick={() => window.location.reload()}>
            Reset All Filters
          </Button>
          <Button variant="outline" className="rounded-full bg-white/50" onClick={() => router.push("/")}>
            Back to Search
          </Button>
        </div>
      </div>
    );
  }
  return (
  <div
    className="w-full rounded-3xl p-7 pt-3 animate-fade-up-4"
    style={{
      background: "rgba(253,252,249,0.75)",
      border: "1px solid rgba(255,255,255,0.85)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 4px 40px rgba(26,23,20,0.10)",
    }}
  >
    <div className="space-y-1">
      {flights.length > 0 && (
        <div className="flex flex-row items-center justify-center w-full mb-4 gap-8">
          <SortControl options={sortOptions} value={sortKey} onChange={setSortKey} />
          <GroupControl options={groupOptions} value={groupKey} onChange={setGroupKey} />
          <Button
            onClick={() => window.location.reload()}
            className="group relative flex justify-center items-center gap-2 px-6 rounded-2xl transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(196, 113, 114, 0.3)",
              color: "black",
            }}
          >
            <RefreshCw
              className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180"
              style={{ color: "#c4714a" }}
            />
            <span className="leading-none tracking-wide text-sm">Retry Search</span>
          </Button>
        </div>
      )}
      <Accordion 
        type="multiple" 
        className="w-full space-y-4" 
        defaultValue={processedData?.map(group => group.label)}
      >
        {processedData?.map((group) => (
          <AccordionItem 
            key={group.label} 
            value={group.label} 
            className="border-none"
          >
            <AccordionTrigger className="hover:no-underline p-0 opacity-80 hover:opacity-100 transition-opacity justify-center">
              <div className="relative flex py-2 items-center w-full">
                <div style={{ borderColor: "rgba(252, 173, 108, 0.6)" }}className="flex-grow border-t border-2 border-black/10"></div>
                <Badge 
                  variant="outline"
                  className="border-6"
                  style={{ 
                    background: "rgba(253, 196, 130, 0.66)",
                    borderColor: "rgba(252, 173, 108, 0.6)",
                  }}
                >
                  <span className="flex-shrink mx-4 text-sm font-md uppercase tracking-widest">
                    {group.label} ({group.flights.length})
                  </span>
                </Badge>
                <div style={{ borderColor: "rgba(252, 173, 108, 0.6)" }} className="flex-grow border-t border-2 border-black/10"></div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-3">
                {group.flights.map((flight, idx) => (
                  <AccordionItem
                    key={`${group.label}-flight-${idx}`}
                    value={`item-${idx}`}
                    className="border-none rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl relative"
                    style={{
                      background: "rgba(255, 255, 255, 0.75)",
                      backdropFilter: "blur(25px)",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {!!flight.savedEntry && (
                      <div className="absolute top-0 left-3 z-30 pointer-events-none">
                        <div className="bg-[#c4714a] text-white px-1 pb-1 pt-2 rounded-b-md shadow-md flex items-center justify-center transition-all">
                          <BookmarkCheck className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                    <AccordionTrigger className="hover:no-underline p-4">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div
                          className="flex flex-col items-center gap-1 border border-gray-200/30 rounded-xl p-3 w-36 shadow-sm divide-y-2 divide-grey-700"
                          style={{ background: "rgba(255, 243, 233, 0.8)" }}
                        >
                          <span className="font-bold text-lg" style={{ color: "#1a1714" }}>
                            {flight.legs[0]?.airline || "NA"}
                          </span>
                          <span className="text-xs uppercase tracking-wider opacity-60">
                            {flight.cabin}
                          </span>
                        </div>

                        <div className="flex flex-col w-fit divide-y-2 divide-grey-700">
                          <LegNode seg={flight.departure_leg} />
                          {flight.return_leg && <LegNode seg={flight.return_leg} landing />}
                        </div>

                        <div
                          className="text-right border border-gray-200/30 rounded-xl p-3 w-32 shadow-sm"
                          style={{ background: "rgba(255, 243, 233, 0.8)" }}
                        >
                          <span className="text-xl font-bold" style={{ color: "#c4714a" }}>
                            ${parseFloat(flight.price).toFixed(2)}
                          </span>
                          <p className="text-[10px] uppercase font-bold opacity-40">
                            {flight.currency}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent
                      className="px-6 pb-4 pt-2"
                      style={{ background: "rgba(253, 252, 249, 0.75)" }}
                    >
                      {/* contains the accordion timelines */}
                      <FlightTimelineContent 
                        flight={flight} 
                        saveFlights={saveFlights} 
                        removeFlights={removeFlights}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);
}

function FlightTimelineContent({ flight, saveFlights, removeFlights }: { flight: ProcessedFlight; saveFlights: (flight: Flight) => void; removeFlights: (id: string) => void; }) {
  return(
    <div className="space-y-2">
      <div
        className="border rounded-xl border-gray-200 overflow-x-auto shadow-sm"
        style={{
          background: "rgba(255, 243, 233, 0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        <FlightTimeline label="Departure" seg={flight.departure_leg} />
      </div>
      {flight.return_leg && (
        <div
          className="border rounded-xl border-gray-200 overflow-x-auto shadow-sm"
          style={{
            background: "rgba(255, 243, 233, 0.8)",
            backdropFilter: "blur(20px)",
          }}
        >
          <FlightTimeline label="Return" seg={flight.return_leg} />
        </div>
      )}
      <div className="flex flex-row items-center justify-center pt-2">
        {flight.booking_url && (
          <a
            href={flight.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="w-48 rounded-full shadow-md transition-all hover:scale-105"
              style={{ background: "#c4714a", color: "white" }}
            >
              Book This Trip
            </Button>
          </a>
        )}
        <div className="pl-4">
          <SaveButton
            saved={!!flight.savedEntry}
            onSave={() => saveFlights({ ...flight })}
            onRemove={() => {
              if (flight.savedEntry) removeFlights(flight.savedEntry.id);
            }}
          />
        </div>
      </div>
    </div>
  )
}

function LegNode({ seg, landing }: { seg: Segment, landing?: boolean}) {
  const legs = seg.segments
  const dep = legs.at(0)
  const arr = legs.at(-1)

  if (!dep || !arr) {
    return (
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-12 px-4 py-1.5 rounded-xl bg-white/30">
          Unable to obtain flight data
        </div>
      </div>
    )
  } else {
    return (
    <div className="space-y-4">
      <div className="flex flex-row items-center gap-12 px-4 py-1.5 rounded-xl bg-white/30">
        <FlightNode 
          airport={legs[0].origin} 
          time={dep.departure_time} 
          compact={false}
        />
        <div className="flex flex-col items-center justify-center gap-1 min-w-[140px]">
          <div 
            className="flex items-center justify-center p-1 rounded-xl border border-gray-200/50 backdrop-blur-sm bg-black/2"
            style={{ background: "rgba(250, 223, 201, 0.8)" }}
          >
            { landing ? 
              <PlaneLanding 
                className="w-6 h-6 -scale-x-100 pb-1" 
                style={{ color: "#b65325" }}
              />:
              <PlaneTakeoff 
                className="w-6 h-6`d`````````` pb-1"
                style={{ color: "#c4714a" }}
              /> 
            }
          </div>
          <span className="text-sm" style={{ color: "#6b6560" }}>
            <Badge
              variant="secondary" 
              className="rounded-sm bg-white/50 border-gray-200/50 px-1 font-medium flex gap-2 items-center" 
              style={{ background: "rgba(235, 162, 102, 0.9)"}}
            >
              {formatDuration(seg.duration)}
            </Badge>
          </span>
          <div className="flex flex-row items-center justify-center">
            {seg?.total_stops > 0 &&
            <Badge 
              variant="outline" 
              className="rounded-sm py-0 px-1 border-gray-300 text-xs" 
              style={{ background: "rgba(197, 138, 90, 0.1)" }}>
              <div>{seg.total_stops}</div>
              <CircleMinus 
                className="w-3 h-3" 
                style={{ color: "#c4714a" }} 
              />
            </Badge>
            }
          </div>
        </div>
        <FlightNode 
          airport={arr.destination} 
          time={arr.arrival_time} 
          compact={false}
        />
      </div>
    </div>
  );
  }
}

function FlightNode({ airport, time, compact }: { airport: string; time: string; compact: boolean }) {
  const airportData = airportsjs.lookupByIataCode(airport).city;
  return (
    <div className={`flex flex-col text-center items-center justify-center gap-0.5 ${compact ? "w-20" : "w-40"}`}>
      <span className="flex flex-wrap justify-center items-baseline gap-1.5">
        <div className="text-lg" style={{ color: "#1a1714" }}>
          {airportData}
        </div>
        <div className="font-mono opacity-70 uppercase tracking-tighter">
          {airport}
        </div>
      </span>
      <span className="text-sm font-medium opacity-80" style={{ color: "#6b6560" }}>
        <Badge
          variant="outline" 
          className="rounded-sm bg-gray-300/10 border-1 border-gray-300 px-1 font-medium flex gap-2 items-center" 
        >
          {formatTime(time)}
        </Badge>
      </span>
    </div>
  );
}