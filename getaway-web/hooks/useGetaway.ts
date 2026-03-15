"use client";

import { useState, useEffect, useRef } from "react";

interface GetawayParams {
  lat: number;
  lng: number;
}

export function useGetaway(params?: GetawayParams) {
  console.log("Cordinates: ", params)
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  const fetchGetaways = async (manualParams?: GetawayParams) => {
    const activeParams = manualParams || params;
    
    if (!activeParams) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      setLoading(true);
        const res = await fetch("http://localhost:5000/api/getaway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            latitude: activeParams.lat,  // Change 'lat' to 'latitude'
            longitude: activeParams.lng, // Change 'lng' to 'longitude'
        }),
        });

      if (!res.ok) throw new Error("Failed to fetch getaways");

      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Getaway Fetch Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.lat && params?.lng) {
      hasFetched.current = false;
      fetchGetaways();
    }
  }, [params?.lat, params?.lng]);

  return { data, loading, fetchGetaways };
}