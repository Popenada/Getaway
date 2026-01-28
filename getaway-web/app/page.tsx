"use client";
import { useState } from "react";
import SearchComponent from "@/components/SearchBar";
export default function SearchTab() {
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [location, setLocation] = useState("");
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search
      </h1>
      <SearchComponent
        location={location}
        setLocation={setLocation}
        
        returnDate={returnDate}
        setReturnDate={setReturnDate}

        departureDate={departureDate}
        setDepartureDate={setDepartureDate}/>
    </main>
  );
}
