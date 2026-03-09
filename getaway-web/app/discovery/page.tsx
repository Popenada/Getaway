"use client";

import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Leg, Flight } from "@/lib/types"

const TOP_DESTINATIONS = ["Tokyo", "London", "Paris", "New York"];
const AIRPORTS = ["SFO", "LAX", "JFK", "SEA", "ORD", "NRT", "LHR", "CDG"];

const formatDuration = (d: string) => d.replace('PT', '').replace('H', 'h ').replace('M', 'm').toLowerCase();

const generateDummyFlights = (): Flight[] => Array.from({ length: 5 }).flatMap((_, d) => {
  const date = new Date(Date.now() + d * 3 * 86400000).toISOString().split('T')[0];
  return Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map(() => {
    const origin = AIRPORTS[Math.floor(Math.random() * 4)];
    const dest = AIRPORTS[Math.floor(Math.random() * 4) + 4];
    return {
      price: (Math.random() * 1200 + 300).toFixed(2), currency: "USD", cabin: "ECONOMY",
      legs: [
        { origin, destination: dest, departure_time: `${date}T08:00`, arrival_time: `${date}T16:00`, stops: 0, duration: "PT8H0M", airline: "UA" },
        { origin: dest, destination: origin, departure_time: `${date}T20:00`, arrival_time: `${date}T04:00`, stops: 0, duration: "PT7H45M", airline: "UA" }
      ]
    };
  });
});

export default function DiscoveryPage() {
  const [selected, setSelected] = useState<string[]>([]);
  
  const groupedFlights = useMemo(() => generateDummyFlights().reduce((acc, flight) => {
    const date = flight.legs[0]?.departure_time.split('T')[0] || "Unknown";
    return { ...acc, [date]: [...(acc[date] || []), flight] };
  }, {} as Record<string, Flight[]>), []);

  return (
    <main className="p-6 min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight">Getaway</h1>
        
        {/* Generate inline toggle buttons */}
        <div className="flex items-center gap-4 py-2">
          <span className="font-bold text-gray-700">Popular:</span>
          <div className="flex gap-2 flex-wrap">
            {TOP_DESTINATIONS.map(city => (
              <button key={city}
                onClick={() => setSelected(p => p.includes(city) ? p.filter(c => c !== city) : [...p, city])}
                className={
                    `px-4 py-1.5 rounded-full text-sm font-medium border transition-all 
                    ${
                        selected.includes(city) ? "bg-green-600 border-green-600 text-white shadow-md" : "bg-white border-gray-200 hover:border-gray-400 shadow-sm"
                    }`
                }>
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10 pt-4">
          {Object.entries(groupedFlights).map(([date, entries]) => (
            <div key={date} className="space-y-4">
              <div className="inline-flex bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="space-y-3">
                {entries.map((flight, i) => (
                  <div key={i} className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-12">
                      {flight.legs.map((leg, j) => (
                        <div key={j} className="flex items-center gap-8">
                          <span className="text-xl font-bold w-10 text-center"> 
                            {leg.origin}
                          </span>
                          <div className="flex flex-col items-center min-w-[80px]">
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                                {formatDuration(leg.duration)}
                            </span>
                          </div>
                          <span className="text-xl font-bold w-10 text-center">
                            {leg.destination}
                          </span>
                          {j === 0 && 
                            <div className="h-10 w-px bg-gray-200 ml-4" />
                          }
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-green-600 tracking-tighter">
                        ${flight.price}
                      </span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                        {flight.cabin}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
