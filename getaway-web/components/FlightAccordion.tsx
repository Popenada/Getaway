// src/components/FlightAccordion.tsx
"use client";

import { PlaneTakeoff } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

import airportsjs from 'airportsjs';
import { formatDuration } from "@/lib/utils";
import { Flight, Leg } from "@/lib/types"; 

interface FlightAccordionProps {
  flights: Flight[];
}

export function FlightAccordion({ flights }: FlightAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {flights.map((flight, idx) => (
        <AccordionItem
          key={"flight-" + idx}
          value={`item-${idx}`}
          className="border rounded-lg bg-white px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex justify-between items-center w-full">
              {/* Airline & Cabin */}
              <div className="flex flex-col items-start gap-1 border-2 border-gray-200 bg-gray-50 rounded-lg p-2">
                <span className="font-semibold text-lg text-gray-900">
                  {flight.legs[0]?.airline || "NA"}
                </span>
                <span className="text-sm text-gray-500 uppercase">
                  {flight.cabin}
                </span>
              </div>

              {/* Main Summary (First Leg) */}
              <div className="flex w-fit p-1 text-right gap-16">
                <LegNode legs={flight.legs.slice(0, 1)} />
              </div>

              {/* Price */}
              <div className="text-right border-2 border-gray-200 rounded-lg bg-gray-50 p-2">
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
              <div className="flex items-center gap-16 pr-10">
                <LegNode legs={flight.legs.slice(1)} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
function LegNode({ legs }: { legs: Leg[] }) {
  return (
    <>
      {legs.map((leg, jdx) => (
        <div key={jdx} className="flex flex-row gap-16 bg-gray-50">
          <FlightNode airport={leg.origin} time={leg.departure_time} />
          <div className="flex flex-col items-center justify-center gap-1 bg-gray">
            <PlaneTakeoff className="w-4 h-4 text-gray-400" />
            <span>
              {formatDuration(leg.duration)}
            </span>
          </div>
          <FlightNode airport={leg.destination} time={leg.arrival_time} />
        </div>
      ))}
    </>
  )
}

function FlightNode({ airport, time }: { airport: string; time: string }) {
  const airportData = airportsjs.lookupByIataCode(airport).city;
  console.log("AIRPORT: ",airportData)
  return (
    <div className="flex flex-col items-center gap-1 border-2 border-gray-200 rounded-lg p-2 min-w-[100px]">
      <span className="flex flex-row justify-center">
        <div className="font-semibold">
          {airportData}
        </div>
        <div className="w-2" />
        <div className="text-gray-600">
          {airport}
        </div>
      </span>
      <span>
        {new Date(time).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })}
      </span>
    </div>
  );
}