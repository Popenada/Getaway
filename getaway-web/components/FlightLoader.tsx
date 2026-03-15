"use client";

interface FlightLoaderProps {
  message?: string;
}

export default function FlightLoader({ 
  message = "Analyzing Flight Paths" 
}: FlightLoaderProps) {
  return (
    <div className="py-24 flex flex-col items-center gap-6 w-full">
      {/* Staggered Bounce Animation */}
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#c4714a] animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-[#c4714a] animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-[#c4714a] animate-bounce" />
      </div>
      {/* Modern Subtitle */}
      <span className="text-sm font-black uppercase tracking-widest text-[#6b6560] animate-pulse">
        {message}
      </span>
    </div>
  );
}