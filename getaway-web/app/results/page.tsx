"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Users, Plane, DollarSign } from "lucide-react";
import airportsjs from 'airportsjs';

import { useFlights } from "@/hooks/useFlights";
import { FlightAccordion } from "@/components/FlightAccordion";
import FlightLoader from "@/components/FlightLoader";
import Header from "@/components/Header"

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
      <main className="getaway-bg relative min-h-screen flex items-center justify-center">
        <FlightLoader message="Finding your escape" />
      </main>
    );
  }
  // console.log(searchParams)
  const origin = searchParams.get("departureCodes")?.split(",").filter(Boolean) ?? [];
	const destination = searchParams.get("arrivalCodes")?.split(",").filter(Boolean) ?? [];

  return (
    <main className="getaway-bg relative min-h-screen p-6 font-sans">
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <Header />
        <h1 className="flex items-center text-3xl font-bold text-gray-900 mb-2">
          {/* Flight Location Display */}
          <div className="flex flex-row items-center">
            {origin.map((code, idx) => {
              return(
                <span key={idx} className="flex gap-1 justify-center items-end">
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
                <span key={`${code}-${idx}`} className="flex gap-1 justify-center items-end">
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
        <QueryDisplay />
        {/* Flight Accordion Display */}
        <FlightAccordion 
          flights={flights} 
          loading={loading} 
        />
      </div>
    </main>
  );

  function QueryDisplay() {
    return (
      <div className="flex flex-row gap-2 mb-2">
        <Badge 
          variant="outline" 
          className="rounded-full bg-white/70 border-gray-200/50 px-4 py-1.5 font-medium flex gap-2 items-center" 
          style={{ color: "#6b6560" }}
        >
          <Calendar className="w-3.5 h-3.5" />
          {searchParams.get("departureDate")} - {searchParams.get("returnDate")}
        </Badge>
        <Badge 
          variant="outline" 
          className="rounded-full bg-white/70 border-gray-200/50 px-4 py-1.5 font-medium flex gap-2 items-center" 
          style={{ color: "#6b6560" }}
        >
          <Users className="w-3.5 h-3.5" />
          {searchParams.get("travelers")} {Number(searchParams.get("travelers")) > 1 ? "Travelers" : "Traveler"}
        </Badge>
        <Badge 
          variant="outline" 
          className="rounded-full bg-white/70 border-gray-200/50 px-4 py-1.5 font-medium flex gap-2 items-center" 
          style={{ color: "#6b6560" }}
        >
          <Plane className="w-3.5 h-3.5" />
          {searchParams.get("roundTrip") === "true" ? "Round Trip" : "One Way"}
        </Badge>
        {searchParams.get("maxPrice") && searchParams.get("maxPrice") !== "10000" && (
          <Badge 
            variant="outline" 
            className="rounded-full bg-white/70 border-gray-200/50 px-4 py-1.5 font-medium flex gap-2 items-center" 
            style={{ color: "#6b6560" }}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Under ${searchParams.get("maxPrice")}
          </Badge>
        )}
      </div>
    )
  }
}