"use client";

import { Leg } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { PlaneTakeoff } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlightTimeline({ legs, label }: { legs: Leg[], label: string }) {
  if (legs.length === 0) return null;

  return (
    <div className="flex flex-col w-full mb-6">
      <div className="flex items-center gap-2 mb-4">
        <PlaneTakeoff 
          className={cn("w-4 h-4", label === "Return" ? "rotate-180" : "")} 
          style={{ color: "#c4714a" }} 
        />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: "#6b6560" }}>
          {label} Flight
        </span>
      </div>
      <div 
        className="relative flex items-center px-10 py-12 rounded-2xl overflow-x-auto border border-white/40 shadow-inner"
        style={{ 
          background: "rgba(255, 255, 255, 0.35)", 
          backdropFilter: "blur(20px)",
          boxShadow: "inset 0 0 20px rgba(255,255,255,0.5)"
        }}
      >
        <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-gray-300/40 -translate-y-[22px]" />
        
        <div className="flex justify-between w-full min-w-[500px]">
          {legs.map((leg, idx) => (
            <div key={idx} className="relative z-10 flex items-center flex-1">
              
              {/* origin node */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div 
                  className="w-11 h-11 rounded-full bg-white border-2 flex items-center justify-center shadow-sm" 
                  style={{ borderColor: "#c4714a" }}
                >
                  <span className="text-xs font-bold" style={{ color: "#1a1714" }}>{leg.origin}</span>
                </div>
                <span className="text-[10px] mt-2 font-semibold" style={{ color: "#1a1714" }}>
                  {new Date(leg.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* airline and duration info */}
              <div className="flex-1 flex flex-col items-center px-2 pb-8">
                <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/80 border border-white/50 mb-1 shadow-sm" style={{ color: "#c4714a" }}>
                  {leg.airline}
                </span>
                <span className="text-[10px] font-medium opacity-60" style={{ color: "#6b6560" }}>
                  {formatDuration(leg.duration)}
                </span>
              </div>
              {idx === legs.length - 1 && (
                <div className="flex flex-col items-center min-w-[100px]">
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105" 
                    style={{ background: "#c4714a" }}
                  >
                    <span className="text-xs font-bold text-white">{leg.destination}</span>
                  </div>
                  <span className="text-[10px] mt-2 font-semibold" style={{ color: "#1a1714" }}>
                    {new Date(leg.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}