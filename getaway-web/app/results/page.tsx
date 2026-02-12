"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import DateGrid from "@/components/DateGrid";
import SortControl, { SortOption } from "@/components/SortControl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

import { sortData } from "@/lib/sortUtils";

const USE_MOCK_DATA = true;

type Leg = {
	origin: string;
	destination: string;
	departure_time: string;
	arrival_time: string;
	stops: number;
	duration: string;
	airline: string;
};

type Flight = {
	legs: Leg[];
	price: string;
	currency: string;
	cabin: string;
};

export default function ResultsPage() {
  const searchParams = useSearchParams();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Sorting states
  const [sortKey, setSortKey] = useState("price_asc"); // tracks sort order
  
  useEffect(() => {
		const fetchFlights = async () => {
			const res = await fetch("http://localhost:5000/api/flight-search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					origin: searchParams.get("origin"),
					destination: searchParams.get("destination"),
					departure: searchParams.get("departure"),
					return: searchParams.get("return"),
					adults: parseInt(searchParams.get("adults") || "1"),
				}),
			});

			const data = await res.json();

      console.log("FRONTEND RECEIVED:", data);

			setFlights(data);
			setLoading(false);
		};

		fetchFlights();
	}, [searchParams]);

  if (loading) {
    return (
      <main className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Searching for flights...</p>
      </main>
    );
  }

  const origin = flights.length > 0 && flights[0].legs.length > 0 ? flights[0].legs[0].origin : '';
	const destination = flights.length > 0 && flights[0].legs.length > 0 ? flights[0].legs[0].destination : '';

  // renamed pricesByDate to parsedData
  const parsedData = flights.reduce((acc: { date: string; price: number }[], flight) => {
		if (!flight.legs || flight.legs.length === 0) return acc;
		const date = flight.legs[0].departure_time.split('T')[0];
		const price = parseFloat(flight.price as unknown as string);

		const existingDate = acc.find(item => item.date === date);
		if (existingDate) {
			if (price < existingDate.price) {
				existingDate.price = price;
			}
		} else {
			acc.push({ date, price });
		}
		return acc;
	}, []);

  const useRealData = parsedData.length > 0;
  
  const sortOptions: SortOption[] = [
    { label: "Price (Lowest)", value: "price_asc" },
    { label: "Price (Highest)", value: "price_dsc" },
    { label: "Date (Ascending)", value: "date_asc"},
    { label: "Date (Descending)", value: "date_dsc"}
  ];

  const sortConfig = {
    price_asc: { key: "price", type: "number", order: "asc" },
    price_dsc: { key: "price", type: "number", order: "dsc" },
    date_asc: { key: "date", type: "date", order: "asc" },
    date_dsc: { key: "date", type: "date", order: "dsc"}
  } as const;

  const activeConfig = sortConfig[sortKey as keyof typeof sortConfig];

  const dataToSort = useRealData 
    ? parsedData 
    : parsedData;

  // default sort if it doesn't work
  const sortedFlights = sortData(
    dataToSort,
    activeConfig.key as any,
    activeConfig.type as "number" | "string" | "date",
    activeConfig.order
  );
  const sortedDetailedFlights = sortData(
    flights,
    "price" as any,
    "number",
    activeConfig.order
  )

  const { key, type, order } = activeConfig || { 
    key: "price", 
    type: "number", 
    order: "asc" 
  };

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="flex items-center text-3xl font-bold text-gray-900 mb-6">
          {origin || "Flight Search"} {destination && <><ArrowRight className="mx-2 text-gray-400" /> {destination}</>}
        </h1>
        {sortedDetailedFlights.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-gray-500">No flights found for this route.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
          {sortedDetailedFlights.map((flight, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border rounded-lg bg-white px-4 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold text-lg text-gray-900">
                      {flight.legs[0]?.airline || "NA"}
                    </span>
                    <span className="text-sm text-gray-500 uppercase">
                      {flight.cabin}
                    </span>
                  </div>
                  <div className="flex items-center w-fit border-2 border-gray-200 rounded-lg p-1 bg-gray-50 text-right">
                    {flight.legs.length > 0 ? 
                    <span className="flex items-center gap-1">
                      {new Date(flight.legs[0].departure_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}

                      {flight.legs.length > 2 ?
                        <div className="flex items-center w-fit border-2 border-gray-200 rounded-lg p-1 bg-gray-200">
                          {flight.legs.length - 1} stops
                        </div>
                      : 
                        <ArrowRight className="w-4 h-4"/>
                      }

                      {new Date(flight.legs.at(-1)?.arrival_time ?? "").toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                    : 
                    <span>
                      No Dates Found
                    </span>
                    }
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-600">
                      ${parseFloat(flight.price).toFixed(2)}
                    </span>
                    <p className="text-xs text-grey-400">{flight.currency}</p>
                  </div>
                </div>
              </AccordionTrigger>
              {/* type Leg = {
                origin: string;
                destination: string;
                departure_time: string;
                arrival_time: string;
                stops: number;
                duration: string;
                airline: string;
              };

              type Flight = {
                legs: Leg[];
                price: string;
                currency: string;
                cabin: string;
              }; */}
              <AccordionContent>
                <div className="flex flex-col gap-1 p-1">
                  {flight.legs.map((leg, jdx) => (
                  <div className="w-fit border-2 border-gray-200 rounded-lg p-1 bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <span className="font-semibold">{leg.origin}</span>
                      <span>{new Date(leg.arrival_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span className="font-semibold">{leg.destination}</span>
                      <span>{new Date(leg.departure_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          </Accordion>
        )}
      </div>
    </main>
  );
}