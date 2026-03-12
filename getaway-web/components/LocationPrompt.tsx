"use client";

import { useState } from "react";
import Link from "next/link";

import { X } from "lucide-react";

import { getCoordsFromCity } from "@/lib/coords";

export default function LocationPrompt({ onSelect }: { onSelect: (c: {lat: number, lng: number}) => void }) {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await getCoordsFromCity(city);
    if (result) onSelect({ lat: result.lat, lng: result.lng });
    else alert("City not found.");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="relative w-full max-w-xl py-12 px-8 rounded-3xl flex flex-col items-center">
        <Link 
          href="/" 
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100/50 hover:bg-gray-100 transition-colors group"
        >
          <X className="w-6 h-6 text-black/60 group-hover:text-black" />
        </Link>
        <h1 
            className="text-center leading-[0.92] mb-6 animate-fade-up-2"
            style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(48px, 7vw, 80px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "#1a1714",
            }}
        >
            Start your next <br/> <em style={{ color: "#c4714a" }}> Getaway </em>from...
        </h1>
        <button 
          onClick={() => navigator.geolocation.getCurrentPosition((p) => onSelect({lat: p.coords.latitude, lng: p.coords.longitude}))}
          className="mb-6 font-medium text-lg text-gray-500 hover:text-[#c4714a] transition-colors"
        >
          Use your current location or
        </button>
        <form onSubmit={handleSearch} className="flex flex-col w-full max-w-sm gap-3">
          <input 
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter a city name..."
            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c4714a]/20"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#c4714a] text-white rounded-2xl font-bold transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Finding..." : "Search Flights"}
          </button>
        </form>
      </div>
      
    </div>
  );
}