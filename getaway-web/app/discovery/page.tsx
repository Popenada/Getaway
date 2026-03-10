"use client";

import { usePathname, useRouter } from "next/navigation";
import { 
  useState, 
  useMemo, 
  useEffect, 
  useLayoutEffect, 
  useRef
} from "react";

import SortControl, { SortOption } from "@/components/SortControl";
import { sortData } from "@/lib/sortUtils";
import { Button } from "@/components/ui/button"
import { FlightAccordion } from "@/components/FlightAccordion";

import { useFlights } from "@/hooks/useFlights";

import destinations from "@/lib/data/destination.json";

import { MOCK_FLIGHTS } from "@/lib/data/mockData";

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
  
  const router = useRouter();
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

  const [sortKey, setSortKey] = useState("price_asc");

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("departureCodes", "LAX");
    params.set("arrivalCodes", "JFK");
    params.set("departureDate", "2027-01-15");
    params.set("travelers", "1");
    // [UPDATE URL without a full refresh so hook sees params]
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname]);

  const { flights, loading } = useFlights(testParams);

  useEffect(() => {
    const params = new URLSearchParams(testParams);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname, testParams]);

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

  const sortOptions: SortOption[] = [
      { label: "Price (Lowest)", value: "price_asc" },
      { label: "Price (Highest)", value: "price_dsc" },
      { label: "Date Departure (Earliest)", value: "date_dep_asc" },
      { label: "Date Departure (Latest)", value: "date_dep_dsc" },
      { label: "Date Arrival (Earliest)", value: "date_arr_asc" },
      { label: "Date Arrival (Latest)", value: "date_arr_dsc" },
  
    ];
    
  return (
    <main className="p-6 min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight">Getaway</h1>
        {loading ?? 
        <div>
          LOADING
        </div>
        }
        {/* Generate inline toggle buttons */}
        <div className="flex items-center gap-4 py-2">
          <span className="font-bold text-gray-700">
            Popular:
          </span>
          <div className="flex flex-wrap justify-center gap-1">
            {displayDestinations.slice(0, limit).map(dest => (
              <Button 
                key={`button-${dest.airportCode}`}
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
