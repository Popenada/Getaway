"use client";

import useSavedFlights from "@/hooks/SavedFlights";
import { SavedFlightEntry, Leg } from "@/lib/types";
import { Bookmark, Plane } from "lucide-react";
import Header from "@/components/Header";

// Formats an ISO datetime string into "Apr 23, 9:40 PM"
function formatTime(datetime: string) {
  return new Date(datetime).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
// Format duration of flight
const formatDuration = (isoDuration: string) => {
    return isoDuration
      .replace('PT','')
      .replace('H',' hr ')
      .replace('M',' min')
      .toLowerCase();
}
function LegRow({ leg }: { leg: Leg }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: "#f5ece6" }}
    >
      {/* Origin */}
      <div className="flex flex-col items-center min-w-[52px]">
        <span className="text-[15px] font-bold" style={{ color: "#1a1714" }}>
          {leg.origin}
        </span>
        <span className="text-[11px] whitespace-nowrap" style={{ color: "#6b6560" }}>
          {formatTime(leg.departure_time)}
        </span>
      </div>

      {/* Flight path */}
      <div className="flex flex-col items-center flex-1 gap-1">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-px" style={{ background: "#e8e0d4" }} />
          <Plane size={13} style={{ color: "#b8b3ad" }} />
          <div className="flex-1 h-px" style={{ background: "#e8e0d4" }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "#000000" }}>
            {formatDuration(leg.duration)}
          </span>
          {/* Nonstop vs stops badge */}
          <span
            className="text-[9px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full"
            style={
              leg.stops === 0
                ? { background: "rgba(122,140,126,0.12)", color: "#5a7a5e" }
                : { background: "rgba(196,113,74,0.10)", color: "#c4714a" }
            }
          >
            {leg.stops === 0 ? "Nonstop" : `${leg.stops} stop${leg.stops > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {/* Destination */}
      <div className="flex flex-col items-center min-w-[52px]">
        <span className="text-[15px] font-bold" style={{ color: "#1a1714" }}>
          {leg.destination}
        </span>
        <span className="text-[11px] whitespace-nowrap" style={{ color: "#6b6560" }}>
          {formatTime(leg.arrival_time)}
        </span>
      </div>
    </div>
  );
}

// Renders a single saved flight card with summary header and leg rows
function SavedFlightCard({
  flight,
  onRemove,
}: {
  flight: SavedFlightEntry;
  onRemove: () => void;
}) {
  const firstLeg = flight.legs[0];
  const lastLeg = flight.legs[flight.legs.length - 1];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "#fdfcf9",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "0 2px 16px rgba(26,23,20,0.07)",
      }}
    >
      <div className="flex items-center gap-4 px-5 py-4">

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "#e8e0d4", color: "#1a1714" }}
        >
          {firstLeg.airline}
        </div>

        {/* Route + meta */}
        <div className="flex flex-col flex-1">
          {/* Origin to Destination */}
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold" style={{ color: "#1a1714" }}>
              {firstLeg.origin}
            </span>
            <span style={{ color: "#c4714a" }}>→</span>
            <span className="text-[17px] font-bold" style={{ color: "#1a1714" }}>
              {lastLeg.destination}
            </span>
          </div>

          {/* Dates + cabin */}
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[9px] font-medium tracking-[0.08em] uppercase"
              style={{ color: "#b8b3ad" }}
            >
              {flight.cabin.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end shrink-0">
          <span
            className="text-[23px] font-semibold leading-none"
            style={{
              fontFamily: "var(-4-font-price), serif",
              color: "#16a34a",
            }}
          >
            ${parseFloat(flight.price).toLocaleString()}
          </span>
          <span
            className="text-[10px] uppercase tracking-widest mt-0.5"
            style={{ color: "#c4714a" }}
          >
            {flight.currency}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 text-sm"
          style={{ background: "#f0ede8", color: "#b8b3ad" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(196,113,74,0.12)";
            e.currentTarget.style.color = "#c4714a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f0ede8";
            e.currentTarget.style.color = "#b8b3ad";
          }}
          title="Remove"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2 px-5 pb-5">
        {flight.legs.map((leg, index) => (
          <div key={`${flight.id}-leg-${index}`}>
            {flight.legs.length > 1 && (
              <span
                className="text-[9px] font-medium tracking-[0.1em] uppercase block mb-1.5"
                style={{ color: "#b8b3ad" }}
              >
                {index === 0 ? "Departure" : "Return"}
              </span>
            )}
            <LegRow leg={leg} />
          </div>
        ))}

        {/* Vendor Link Testing */}
        {flight.booking_url && (
          <a
            href={flight.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-center text-[13px] font-medium rounded-xl py-2.5 transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #c4714a, #a85a38)",
              color: "white",
              boxShadow: "0 4px 16px rgba(196,113,74,0.25)",
            }}
          >
            Book now →
          </a>
        )}
      </div>
    </div>
  );
}

export default function TripsPage() {
  const { saved, removeFlights } = useSavedFlights();

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Page header */}
        <p
          className="text-[11px] font-medium tracking-[0.16em] uppercase mb-3"
          style={{ color: "#c4714a" }}
        >
          Saved
        </p>
        <h1
          className="mb-8"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "52px",
            fontWeight: 300,
            color: "#1a1714",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Your trips.
        </h1>

        {/* Empty state */}
        {saved.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3"
            style={{ color: "#b8b3ad" }}
          >
            <Bookmark size={32} strokeWidth={1.5} />
            <p className="text-sm">No saved flights yet</p>
            <p className="text-xs">Bookmark flights from your search results</p>
          </div>
        )}

        {/* Saved flight cards */}
        <div className="flex flex-col gap-4">
          {saved.map((flight: SavedFlightEntry) => (
            <SavedFlightCard
              key={flight.id}
              flight={flight}
              onRemove={() => removeFlights(flight.id)}
            />
          ))}
        </div>

      </main>
    </>
  );
}