"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
    departureDate: string;
    setDepartureDate: (t: string) => void;

    returnDate: string;
    setReturnDate: (t: string) => void;

    location: string;
    setLocation: (t: string) => void;

    
};

export default function SearchComponent({departureDate, setDepartureDate, returnDate, setReturnDate, location, setLocation}: SearchBarProps) {
    return (
        <div className="flex flex-col gap-3"> 
            <div className="flex flex-col gap-5">
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter a location"
                />
            </div>
            <div className="flex flex-col gap-5">
                <Input
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    placeholder="Enter a return date"
                />
            </div>
            <div className="flex flex-col gap-5">
                <Input
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    placeholder="Enter a departure date"
                />
            </div>
        </div>
    );
}
