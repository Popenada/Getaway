"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/DateRangePicker"
import { DateRange } from "react-day-picker";
type SearchBarProps = {
    dateRange: DateRange | undefined
    setDateRange: (r: DateRange | undefined) => void;

    departureLocation: string;
    setDepartureLocation: (t: string) => void;

    arrivalLocation: string;
    setArrivalLocation: (t: string) => void;

    travelers: string;
    setTravelers: (t: string) => void;
};

export default function SearchComponent({dateRange, setDateRange, departureLocation, 
    setDepartureLocation, arrivalLocation, setArrivalLocation, travelers, setTravelers
}: SearchBarProps) {
    return (
        <div className="flex flex-col gap-3"> 

            <div className="flex gap-5 w-150">

                <p className="text-sm font-medium text-black-600">
                    Departure
                    <Input
                        value={departureLocation}
                        onChange={(e) => setDepartureLocation(e.target.value)}
                        placeholder="Enter departure location"
                    />
                </p>
                <p className="text-sm font-medium text-black-600">
                    Arrival
                    <Input 
                        value={arrivalLocation}
                        onChange={(e) => setArrivalLocation(e.target.value)}
                        placeholder="Enter arrival location"
                    />
                </p>
                
                <Button className="h-10 px-6 mt-4">
                    Search
                </Button>
            </div>

            <div className="flex gap-5 w-80">
                <DateRangePicker value={dateRange} onChange={setDateRange} label="Departure – Return" />
            </div>

            <div className="flex gap-5 w-18">
                <Input
                    type="number"
                    min={1}
                    max={8}
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    placeholder="Travelers"
                />
            </div>
        </div>
    );
}
