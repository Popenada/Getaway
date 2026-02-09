"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DateGrid from "@/components/DateGrid";

type Flight = {
	origin: string;
	destination: string;
	detparture_time: string;
	arrival_time: string;
	stops: number;
	duration: string;
	airline: string;
	price: string;
	currency: string;
	cabin: string;
};

export default function ResultsPage() {
	const searchParams = useSearchParams();

	const [flights, setFlights] = useState<Flight[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
			setFlights(data);
			setLoading(false);
		};

		fetchFlights();
	}, [searchParams]);

	const pricesByDate = flights.reduce((acc: { date: string; price: number }[], flight) => {
		const date = flight.detparture_time.split('T')[0];
		const price = parseFloat(flight.price);
		
		const existingDate = acc.find(item => item.date === date);
		if (existingDate) {
			if (price < existingDate.price) {
				existingDate.price = price;
			}
		} else {
			acc.push({ date, price });
		}
		return acc;
	}, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const selectedFlights = selectedDate 
		? flights.filter(flight => flight.detparture_time.split('T')[0] === selectedDate)
		: [];

	const origin = flights.length > 0 ? flights[0].origin : '';
	const destination = flights.length > 0 ? flights[0].destination : '';

	const handleSelectDate = (date: string) => {
		setSelectedDate(selectedDate === date ? null : date);
	};

	if (loading) {
		return <div className="p-6">Loading...</div>;
	}

	return (
		<main className="p-6">
			<h1 className="text-2xl font-bold mb-4 text-center">
				Flight Results
			</h1>
			{flights.length > 0 && (
				<h2 className="text-2xl font-bold mb-6">
					{origin} to {destination}
				</h2>
			)}

			<DateGrid prices={pricesByDate}
				selectedDate={selectedDate}
				onSelectDate={handleSelectDate}
			/>

			{selectedDate && selectedFlights.length > 0 && (
				<div className="mt-8">
					<h3 className="text-xl font-bold mb-4">Flights on {selectedDate}</h3>
					<div className="space-y-4">
						{selectedFlights.map((flight, idx) => (
							<div key={idx} className="border rounded-lg p-4">
								<div className="flex justify-between items-start">
									<div>
										<p className="font-semibold">{flight.airline}</p>
										<p className="text-sm text-gray-600">{flight.cabin}</p>
									</div>
									<p className="text-lg font-bold">${flight.price}</p>
								</div>
								<div className="mt-3 text-sm text-gray-700">
									<p>{new Date(flight.detparture_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} → {new Date(flight.arrival_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
									<p>Duration: {flight.duration} • Stops: {flight.stops}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<Link href="/">
				<Button className="h-10 px-6 mt-4">
					Back to Home (testing)
				</Button>
			</Link>
		</main>
	);
}