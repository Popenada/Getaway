"use client";

import { usePathname } from "next/navigation";
import { useMemo, useEffect } from "react";

import { Button } from "@/components/ui/button"
import { FlightAccordion } from "@/components/FlightAccordion";

import { useFlights } from "@/hooks/useFlights";

import { MOCK_FLIGHTS } from "@/lib/data/mockData";

export default function DiscoveryPage() {
  const pathname = usePathname();

  const testParams = useMemo(() => ({
    departureLabels: "Los Angeles Intl (LAX)",
    arrivalLabels: "John F Kennedy Intl (JFK)",
    departureCodes: "LAX",
    arrivalCodes: "JFK",
    
    departureDate: "2027-01-15",
    returnDate: "2027-01-17",
    travelers: "1",
    
    triplength: "",
    roundTrip: "true",
    includedAirline: "",
    excludedAirline: "",
    nonstopOnly: "true",

    minPrice: "0",
    maxPrice: "10000",
    departureWindow: "0",
    returnWindow: "0"
  }), []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("departureCodes", "LAX");
    params.set("arrivalCodes", "JFK");
    params.set("departureDate", "2027-01-15");
    params.set("travelers", "1");
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname]);

  const { flights, loading } = useFlights(testParams);

  useEffect(() => {
    const params = new URLSearchParams(testParams);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname, testParams]);
    
  return (
    <main className="getaway-bg relative min-h-screen px-10 pt-8 pb-16 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <p
          className="text-base font-medium tracking-[0.18em] uppercase mb-4 animate-fade-up-1"
          style={{ color: "#c4714a" }}
        >
          Discovery
        </p>
        <h1 
          className="text-center leading-[0.92] mb-12 animate-fade-up-2"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(48px, 7vw, 80px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "#1a1714",
          }}
        >
          <em style={{ color: "#c4714a" }}>Discover</em> your Getaway.
        </h1>
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 text-center text-gray-400 animate-pulse">
              Fetching latest prices...
            </div>
          ) : (
            <FlightAccordion 
              flights={MOCK_FLIGHTS} 
              loading={loading}
            />
          )}
        </div>
      </div>
    </main>
  );
}
