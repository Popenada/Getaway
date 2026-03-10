"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Users, Plane, DollarSign, User } from "lucide-react";
import airportsjs from 'airportsjs';

import { useFlights } from "@/hooks/useFlights";
import { FlightAccordion } from "@/components/FlightAccordion";


export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    flights,
    loading,
    fetchFlights,
  } = useFlights();

  if (loading) {
    return (
      <main className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Searching for flights...</p>
      </main>
    );
  }
  console.log(searchParams)
  const origin = searchParams.get("departureCodes")?.split(",").filter(Boolean) ?? [];
	const destination = searchParams.get("arrivalCodes")?.split(",").filter(Boolean) ?? [];

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="flex items-center text-3xl font-bold text-gray-900 mb-2">
          {/* Flight Location Display */}
          <div className="flex flex-row items-end">
            {origin.map((code, idx) => {
              return(
                <span className="flex gap-1 justify-center items-end">
                  <span className="font-semibold text-xlg">
                    {airportsjs.lookupByIataCode(code).city}
                  </span>
                  <span className="text-gray-600 text-lg font-light">
                    {origin.length - 1 === idx ? code : `${code}, `}
                  </span>
                </span>
              )
            })}
            <ArrowRight className="mx-2 text-gray-400" /> 
            {destination.map((code, idx) => {
              return(
                <span className="flex gap-1 justify-center items-end">
                  <span className="font-semibold text-xlg">
                    {airportsjs.lookupByIataCode(code).city}
                  </span>
                  <span className="text-gray-600 text-lg font-light">
                    {code}
                  </span>
                </span>
              )
            })} 
          </div>
        </h1>
        {/* Search Parameter Display */}
        <div className="flex flex-row gap-2 mb-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium flex gap-1.5 items-center">
            <Calendar className="w-3.5 h-3.5" />
            {searchParams.get("departureDate")} - {searchParams.get("returnDate")}
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium flex gap-1.5 items-center">
            <Users className="w-3.5 h-3.5" />
            {searchParams.get("travelers")} {Number(searchParams.get("travelers")) > 1 ? "Travelers" : "Traveler"}
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium flex gap-1.5 items-center">
            <Plane className="w-3.5 h-3.5" />
            {searchParams.get("roundTrip") === "true" ? "Round Trip" : "One Way"}
          </Badge>
          {searchParams.get("maxPrice") && searchParams.get("maxPrice") !== "10000" && (
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium flex gap-1.5 items-center">
              <DollarSign className="w-3.5 h-3.5" />
              Under ${searchParams.get("maxPrice")}
            </Badge>
          )}
        </div>
        {/* Flight Accordion Display */}
        <FlightAccordion 
          flights={flights} 
          loading={loading} 
        />
      </div>
    </main>
  );
}