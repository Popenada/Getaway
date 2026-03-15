"use client";

import { Leg, Segment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatTime } from "@/lib/utils";
import { PlaneTakeoff } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlightTimeline({ seg, label }: { seg: Segment, label: string }) {
  const legs = seg.segments

  if (legs.length === 0) return null;

  return (
    <div className="flex flex-col w-full mb-6">
      <div className="flex items-center gap-2 mb-2 pl-4 pt-2">
        <PlaneTakeoff 
          className={cn("w-4 h-4", label === "Return" ? "rotate-180" : "")} 
          style={{ color: "#c4714a" }} 
        />
        <span className="text-base font-medium tracking-wide" style={{ color: "#6b6560" }}>
          {label} Flight
        </span>
      </div>
      <div 
        className="relative flex items-center px-10 rounded-2xl"
      >
        <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-gray-300/40 -translate-y-[24px]" />
        
        <div className="flex justify-between w-full min-w-[500px]">
          {legs.map((leg, idx) => (
            <div key={idx} className="relative z-10 flex items-center flex-1">
              
              {/* origin node */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div 
                  className="w-11 h-11 rounded-full bg-white border-2 flex items-center justify-center shadow-sm" 
                  style={{ borderColor: "#c4714a" }}
                >
                  <span className="text-sm font-bold" style={{ color: "#1a1714" }}>{leg.origin}</span>
                </div>
                <span className="text-sm mt-2" style={{ color: "#1a1714" }}>
                  <Badge
                    variant="outline" 
                    className="rounded-sm bg-gray-300/10 border-1 border-gray-300 px-1 font-medium flex gap-2 items-center" 
                  >
                    {formatTime(leg.departure_time)}
                  </Badge>
                </span>
              </div>

              {/* airline and duration info */}
              <div className="flex-1 flex flex-col items-center px-2 pb-8">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/80 border border-white/50 mb-1 shadow-sm" style={{ color: "#c4714a" }}>
                  {leg.airline}
                </span>
                <Badge
                  variant="outline" 
                  className="rounded-sm bg-gray-300/10 border-1 border-gray-300 px-1 font-medium flex gap-2 items-center" 
                >
                  <span className="text-xs font-medium" style={{ color: "#6b6560" }}>
                    {formatDuration(leg.duration)}
                  </span>
                </Badge>
              </div>
              {idx === legs.length - 1 && (
                <div className="flex flex-col items-center min-w-[100px]">
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105" 
                    style={{ background: "#c4714a" }}
                  >
                    <span className="text-sm font-bold text-white">{leg.destination}</span>
                  </div>
                  <span className="text-sm mt-2" style={{ color: "#1a1714" }}>
                    <Badge
                      variant="outline" 
                      className="rounded-sm bg-gray-300/10 border-1 border-gray-300 px-1 font-medium flex gap-2 items-center" 
                    >
                      {formatTime(leg.arrival_time)}
                    </Badge>
                    
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