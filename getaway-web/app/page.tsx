"use client";
import { useState, useEffect } from "react";

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/get-flights")
      .then((response) => response.json())
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching flight data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '5rem' }}>Flight Options</h1>
      {flights.map((flight: any, index: number) => (
        <div key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
          <p>{flight.airline} | {flight.origin} {'->'} {flight.destination}</p>
          <p>Departure: {flight.departure_time} | Arrival: {flight.arrival_time}</p>
          <p>Price: {flight.price} {flight.currency} | Stops: {flight.stops}</p>
        </div>
      ))}
    </div>
  );
}