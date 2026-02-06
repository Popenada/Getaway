<<<<<<< HEAD
"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResultsPage() {
    return (
        <main className="p-50">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Results Page
            </h1>

        <Link href="/">
          <Button className="h-10 px-6 mt-4">
            Back to Home (testing)
          </Button>
        </Link>
        </main>
    );
=======
"use client";
import { useState } from "react";
import DateGrid from "@/components/DateGrid";

const mockResults = {
  origin: "LAX",
  destination: "JFK",
  currency: "USD",
  pricesByDate: [
    { date: "2026-03-10", price: 380 },
    { date: "2026-03-11", price: 395 },
    { date: "2026-03-12", price: 412 },
    { date: "2026-03-13", price: 370 },
    { date: "2026-03-14", price: 365 }
  ]
};

export default function ResultsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {mockResults.origin} to {mockResults.destination}
      </h1>

      <DateGrid prices={mockResults.pricesByDate}
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)} />
    </main>
  );
>>>>>>> 974b491 (basic results page using mock data)
}