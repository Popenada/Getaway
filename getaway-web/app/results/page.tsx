"use client";
import { useState, useEffect } from "react";
import SortControl, { SortOption } from "@/components/SortControl";
import { sortData } from "@/lib/sortUtils";
import DateGrid from "@/components/DateGrid";

const generateMockData = (origin: string, destination: string, days = 30) => ({
  origin,
  destination,
  currency: "USD",
  pricesByDate: Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      price: Math.floor(Math.random() * 401) + 200 // rand 200 - 600
    };
  })
});

const mockResults = generateMockData("LAX", "JFK", 30);


export default function ResultsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState("price_asc"); // tracks sort order
  const [mockResults, setMockResults] = useState<{ origin: string, destination: string, pricesByDate: any[]} | null>(null);

  useEffect(() => {
    setMockResults(generateMockData("LAX", "JFK", 30));
  }, []);

  if (!mockResults) return null;

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
  // default sort if it doesn't work
  const { key, type, order } = activeConfig || { 
    key: "price", 
    type: "number", 
    order: "asc" 
  };

  const sortedPrices = sortData(
    mockResults.pricesByDate,
    activeConfig.key as any, // 'as any' simplifies TS for dynamic keys
    type as "number" | "string" | "date",
    activeConfig.order
  );

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {mockResults.origin} to {mockResults.destination}
          </h1>
          <SortControl 
            options={sortOptions}
            value={sortKey}
            onChange={setSortKey}
          />
        </div>
        <DateGrid
          prices={sortedPrices}
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
        />
      </div>
    </main>
  );
}