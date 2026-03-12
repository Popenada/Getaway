"use client";

import { useState } from "react";

import { useGetaway } from "@/hooks/useGetaway";
import { FlightAccordion } from "@/components/FlightAccordion";
import { MOCK_FLIGHTS } from "@/lib/data/mockData";
import FlightLoader from "@/components/FlightLoader";
import Header from "@/components/Header"
import LocationPrompt from "@/components/LocationPrompt";

const LA_COORDS = { lat: 34.0522, lng: -118.2437 };

export default function DiscoveryPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const { data, loading } = useGetaway(coords || undefined);

  if (!coords) {
    return (
      <main className="getaway-bg min-h-screen">
        <LocationPrompt onSelect={setCoords} />
      </main>
    );
  }

  return (
    <main className="getaway-bg relative min-h-screen px-10 pt-8 pb-16 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <Header />
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
            <FlightLoader />
          ) : (
            <FlightAccordion
              // replace data with MOCK_FLIGHTS for test data
              flights={data}
              loading={loading}
            />
          )}
        </div>
      </div>
    </main>
  );
}
