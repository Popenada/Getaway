"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Flight } from "@/lib/types";

const CACHE_DURATION = 30 * 60 * 1000; 

// updated to accept optional initialParams
export function useFlights(initialParams?: Record<string, string>) {
  const searchParams = useSearchParams();
  
  // prioritize passed params over URL params
  const activeParams = useMemo(() => {
    if (initialParams) {
      return new URLSearchParams(initialParams);
    }
    return searchParams;
  }, [initialParams, searchParams]);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  // use activeParams for the cache key
  const cacheKey = `flights-${activeParams.toString()}`;

  const fetchFlights = async () => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;

      if (!isExpired) {
        const cachedData = Array.isArray(parsed.data) ? parsed.data : (Array.isArray(parsed) ? parsed : (parsed.data ?? []));
        setFlights(cachedData);
        setLoading(false);
        return;
      }
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/flight-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchid: "TEST123",
          departureCodes: activeParams.get("departureCodes")?.split(",").filter(Boolean) ?? [],
          arrivalCodes: activeParams.get("arrivalCodes")?.split(",").filter(Boolean) ?? [],
          departureDate: activeParams.get("departureDate")?.split(",").filter(Boolean) ?? [],
          returnDate: activeParams.get("returnDate")?.split(",").filter(Boolean) ?? [],
          travelers: Number(activeParams.get("travelers") || 1),
          tripLength: Number(activeParams.get("tripLength") || 0),
          roundTrip: activeParams.get("roundTrip"),
          includedAirline: activeParams.get("includedAirline")?.split(",").filter(Boolean) ?? [],
          excludedAirline: activeParams.get("excludedAirline")?.split(",").filter(Boolean) ?? [],
          nonstopOnly: activeParams.get("nonstopOnly"),
          minPrice: Number(activeParams.get("minPrice") || 0),
          maxPrice: Number(activeParams.get("maxPrice") || 0),
          departureWindow: Number(activeParams.get("departureWindow") || 0),
          returnWindow: Number(activeParams.get("returnWindow") || 0),
        }),
      });

      if (!res.ok) {
        setFlights([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setFlights(data);

      localStorage.setItem(cacheKey, JSON.stringify({
        data: data,
        timestamp: Date.now()
      }));

    } catch (err) {
      console.error("Fetch failed:", err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hasFetched.current = false; 
    fetchFlights();
  }, [activeParams]); // Depend on activeParams

  return { flights, loading, fetchFlights, setFlights, setLoading };
}