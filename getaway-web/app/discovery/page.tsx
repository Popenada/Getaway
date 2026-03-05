"use client";

import { 
  useState, 
  useMemo, 
  useEffect, 
  useLayoutEffect, 
  useRef
} from "react";

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ArrowRight } from "lucide-react";
import { Leg, Flight } from "@/lib/types"

import { formatDuration } from "@/lib/utils"
import { FlightAccordion } from "@/components/FlightAccordion";
import destinations from '@/lib/data/destinations.json';

const TOP_DESTINATIONS = ["Tokyo", "London", "Paris", "New York"];
const AIRPORTS = ["SFO", "LAX", "JFK", "SEA", "ORD", "NRT", "LHR", "CDG"];

export default function DiscoveryPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const cityNames = useMemo(() =>
    [...destinations].sort(() => Math.random() - 0.5).map(d => d.city)
  ,[] );
  const [limit, setLimit] = useState(5);
  const remaining = cityNames.length - limit;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [hasExpanded, setHasExpanded] = useState(false);

  const measureRef = useRef<HTMLDivElement>(null);

  const displayDestinations = useMemo(() =>
    [...destinations].sort(() => Math.random() - 0.5)
  , []);

  const toggleSelection = (code: string) => {
    setSelected(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  useLayoutEffect(() => {
    // Stop auto-calculating if the user has manually clicked "View More"
    if (!measureRef.current || hasExpanded) return;

    const calculateLimit = () => {
      // 1. Get the width of the main layout container (max-w-5xl is ~1024px)
      // We subtract the label width (~80px) and button margin
      const availableWidth = measureRef.current!.parentElement?.offsetWidth || 1024;
      const actualAvailable = availableWidth - 100; 

      const buttonNodes = measureRef.current!.querySelectorAll(".measuring-button");

      let currentWidth = 0;
      let count = 0;
      const gap = 4;

      for (let i = 0; i < buttonNodes.length; i++) {
        const btnWidth = (buttonNodes[i] as HTMLElement).offsetWidth + gap;
        // Reserve space for the "+ View More" button (~120px)
        if (currentWidth + btnWidth < actualAvailable - 120) {
          currentWidth += btnWidth;
          count++;
        } else {
          break;
        }
      }
      setLimit(count || 1);
    };

    calculateLimit();
    window.addEventListener("resize", calculateLimit);
    return () => window.removeEventListener("resize", calculateLimit);
  }, [cityNames, hasExpanded]);

  return (
    <main className="p-6 min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight">
          Getaway
        </h1>
        {/* Generate inline toggle buttons */}
        <div className="flex items-center gap-4 py-2">
          <span className="font-bold text-gray-700">
            Popular:
          </span>
          <div className="flex flex-wrap justify-center gap-1">
            {displayDestinations.slice(0, limit).map(dest => (
              <Button 
                variant="outline" 
                className="rounded-full"
              >
                {dest.city}
              </Button>
            ))}
            {remaining > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setLimit(
                  prev => Math.min(prev + 5, cityNames.length)
                )}
                className="text-gray-400 hover:text-green-600 rounded-full"
              >
                + View {remaining > 5 ? 5 : remaining} More
              </Button>
            )}
            {remaining === 0 && (
              <Button 
                variant="outline" 
                onClick={() => setLimit(
                  prev => prev - 5
                )}
                className="text-gray-400 hover:text-red-600 font-semibold"
              >
                - View Less
              </Button>
            )}
          </div>
          {/* Hidden Measurement Container */}
          <div 
            ref={measureRef} 
            className="invisible absolute top-0 left-0 flex flex-wrap gap-1 opacity-0 pointer-events-none w-full max-w-5xl"
          >
            {displayDestinations.map(dest => (
              <Button key={`measure-${dest.airportCode}`} className="measuring-button rounded-full">
                {dest.city}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-10 pt-4">
          {/* <FlightAccordion flights={groupedFlights} /> */}
        </div>
      </div>
    </main>
  );
}
