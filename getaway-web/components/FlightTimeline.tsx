// src/components/FlightTimeline.tsx
"use client";

import { Flight, Leg } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

function FlightTimeline({ legs }: { legs: Leg[] }) {
  return (
    <div className="flex flex-col w-full py-4 px-6 bg-gray-50 rounded-xl border border-gray-100">
      <h4 className="text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider">Journey Details</h4>
      <div className="relative flex justify-between items-start">
        {/* Connecting Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
        
        {legs.map((leg, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center group">
            {/* Airport Node */}
            <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center mb-2 shadow-sm transition-transform group-hover:scale-110">
              <span className="text-[10px] font-bold text-blue-600">{leg.origin}</span>
            </div>
            
            {/* Leg Details */}
            <div className="flex flex-col items-center text-center max-w-[80px]">
              <span className="text-[11px] font-medium text-gray-900">{leg.airline}</span>
              <span className="text-[10px] text-gray-400">{formatDuration(leg.duration)}</span>
            </div>

            {/* Final Destination Node (only for the last leg) */}
            {idx === legs.length - 1 && (
              <div className="absolute -right-4 top-0 translate-x-full flex flex-col items-center">
                 <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-600 flex items-center justify-center mb-2 shadow-sm">
                  <span className="text-[10px] font-bold text-white">{leg.destination}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}