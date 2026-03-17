import { Flight } from "@/lib/types";

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: "1",
    trip_type: "one_way",
    price: "199.00",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-1",
    legs: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T06:00:00", arrival_time: "2026-03-25T14:30:00", stops: 0, duration: "5h 30m", airline: "JetBlue", flight_number: "B6100" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T06:00:00", arrival_time: "2026-03-25T14:30:00", stops: 0, duration: "5h 30m", airline: "JetBlue", flight_number: "B6100" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  },
  {
    id: "2",
    trip_type: "one_way",
    price: "215.50",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-2",
    legs: [{ origin: "SJC", destination: "EWR", departure_time: "2026-03-25T07:15:00", arrival_time: "2026-03-25T15:45:00", stops: 0, duration: "5h 30m", airline: "United", flight_number: "UA422" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "EWR", departure_time: "2026-03-25T07:15:00", arrival_time: "2026-03-25T15:45:00", stops: 0, duration: "5h 30m", airline: "United", flight_number: "UA422" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  },
  {
    id: "3",
    trip_type: "one_way",
    price: "185.00",
    currency: "USD",
    cabin: "Main Cabin",
    booking_url: "https://example.com/book/sjc-nyc-3",
    legs: [
      { origin: "SJC", destination: "SLC", departure_time: "2026-03-25T08:00:00", arrival_time: "2026-03-25T10:45:00", stops: 1, duration: "1h 45m", airline: "Delta", flight_number: "DL310" },
      { origin: "SLC", destination: "JFK", departure_time: "2026-03-25T11:45:00", arrival_time: "2026-03-25T18:00:00", stops: 0, duration: "4h 15m", airline: "Delta", flight_number: "DL889" }
    ],
    departure_leg: { 
      segments: [
        { origin: "SJC", destination: "SLC", departure_time: "2026-03-25T08:00:00", arrival_time: "2026-03-25T10:45:00", stops: 1, duration: "1h 45m", airline: "Delta", flight_number: "DL310" },
        { origin: "SLC", destination: "JFK", departure_time: "2026-03-25T11:45:00", arrival_time: "2026-03-25T18:00:00", stops: 0, duration: "4h 15m", airline: "Delta", flight_number: "DL889" }
      ], 
      total_stops: 1, duration: "7h 00m" 
    },
    return_leg: null
  },
  {
    id: "4",
    trip_type: "one_way",
    price: "192.25",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-4",
    legs: [
      { origin: "SJC", destination: "DFW", departure_time: "2026-03-25T09:30:00", arrival_time: "2026-03-25T14:45:00", stops: 1, duration: "3h 15m", airline: "American", flight_number: "AA105" },
      { origin: "DFW", destination: "JFK", departure_time: "2026-03-25T16:00:00", arrival_time: "2026-03-25T20:15:00", stops: 0, duration: "3h 15m", airline: "American", flight_number: "AA220" }
    ],
    departure_leg: { 
      segments: [
        { origin: "SJC", destination: "DFW", departure_time: "2026-03-25T09:30:00", arrival_time: "2026-03-25T14:45:00", stops: 1, duration: "3h 15m", airline: "American", flight_number: "AA105" },
        { origin: "DFW", destination: "JFK", departure_time: "2026-03-25T16:00:00", arrival_time: "2026-03-25T20:15:00", stops: 0, duration: "3h 15m", airline: "American", flight_number: "AA220" }
      ], 
      total_stops: 1, duration: "7h 45m" 
    },
    return_leg: null
  },
  {
    id: "5",
    trip_type: "one_way",
    price: "220.00",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-5",
    legs: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T11:00:00", arrival_time: "2026-03-25T19:30:00", stops: 0, duration: "5h 30m", airline: "Alaska", flight_number: "AS14" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T11:00:00", arrival_time: "2026-03-25T19:30:00", stops: 0, duration: "5h 30m", airline: "Alaska", flight_number: "AS14" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  },
  {
    id: "6",
    trip_type: "one_way",
    price: "245.50",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-6",
    legs: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T12:30:00", arrival_time: "2026-03-25T21:00:00", stops: 0, duration: "5h 30m", airline: "JetBlue", flight_number: "B6305" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T12:30:00", arrival_time: "2026-03-25T21:00:00", stops: 0, duration: "5h 30m", airline: "JetBlue", flight_number: "B6305" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  },
  {
    id: "7",
    trip_type: "one_way",
    price: "175.00",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-7",
    legs: [
      { origin: "SJC", destination: "ORD", departure_time: "2026-03-25T13:45:00", arrival_time: "2026-03-25T19:45:00", stops: 1, duration: "4h 00m", airline: "United", flight_number: "UA801" },
      { origin: "ORD", destination: "EWR", departure_time: "2026-03-25T21:00:00", arrival_time: "2026-03-25T23:55:00", stops: 0, duration: "1h 55m", airline: "United", flight_number: "UA955" }
    ],
    departure_leg: { 
      segments: [
        { origin: "SJC", destination: "ORD", departure_time: "2026-03-25T13:45:00", arrival_time: "2026-03-25T19:45:00", stops: 1, duration: "4h 00m", airline: "United", flight_number: "UA801" },
        { origin: "ORD", destination: "EWR", departure_time: "2026-03-25T21:00:00", arrival_time: "2026-03-25T23:55:00", stops: 0, duration: "1h 55m", airline: "United", flight_number: "UA955" }
      ], 
      total_stops: 1, duration: "7h 10m" 
    },
    return_leg: null
  },
  {
    id: "8",
    trip_type: "one_way",
    price: "310.00",
    currency: "USD",
    cabin: "Premium Economy",
    booking_url: "https://example.com/book/sjc-nyc-8",
    legs: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T15:00:00", arrival_time: "2026-03-25T23:30:00", stops: 0, duration: "5h 30m", airline: "Delta", flight_number: "DL712" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T15:00:00", arrival_time: "2026-03-25T23:30:00", stops: 0, duration: "5h 30m", airline: "Delta", flight_number: "DL712" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  },
  {
    id: "9",
    trip_type: "one_way",
    price: "165.75",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-9",
    legs: [
      { origin: "SJC", destination: "PHX", departure_time: "2026-03-25T16:30:00", arrival_time: "2026-03-25T19:20:00", stops: 1, duration: "1h 50m", airline: "American", flight_number: "AA440" },
      { origin: "PHX", destination: "JFK", departure_time: "2026-03-25T20:30:00", arrival_time: "2026-03-26T03:00:00", stops: 0, duration: "4h 30m", airline: "American", flight_number: "AA555" }
    ],
    departure_leg: { 
      segments: [
        { origin: "SJC", destination: "PHX", departure_time: "2026-03-25T16:30:00", arrival_time: "2026-03-25T19:20:00", stops: 1, duration: "1h 50m", airline: "American", flight_number: "AA440" },
        { origin: "PHX", destination: "JFK", departure_time: "2026-03-25T20:30:00", arrival_time: "2026-03-26T03:00:00", stops: 0, duration: "4h 30m", airline: "American", flight_number: "AA555" }
      ], 
      total_stops: 1, duration: "7h 30m" 
    },
    return_leg: null
  },
  {
    id: "10",
    trip_type: "one_way",
    price: "205.00",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-10",
    legs: [{ origin: "SJC", destination: "EWR", departure_time: "2026-03-25T18:00:00", arrival_time: "2026-03-26T02:30:00", stops: 0, duration: "5h 30m", airline: "Alaska", flight_number: "AS28" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "EWR", departure_time: "2026-03-25T18:00:00", arrival_time: "2026-03-26T02:30:00", stops: 0, duration: "5h 30m", airline: "Alaska", flight_number: "AS28" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  },
  {
    id: "11",
    trip_type: "one_way",
    price: "180.00",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-11",
    legs: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T19:15:00", arrival_time: "2026-03-26T03:45:00", stops: 0, duration: "5h 30m", airline: "JetBlue", flight_number: "B6511" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T19:15:00", arrival_time: "2026-03-26T03:45:00", stops: 0, duration: "5h 30m", airline: "JetBlue", flight_number: "B6511" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  },
  {
    id: "12",
    trip_type: "one_way",
    price: "190.00",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-12",
    legs: [{ origin: "SJC", destination: "EWR", departure_time: "2026-03-25T20:30:00", arrival_time: "2026-03-26T05:00:00", stops: 0, duration: "5h 30m", airline: "United", flight_number: "UA114" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "EWR", departure_time: "2026-03-25T20:30:00", arrival_time: "2026-03-26T05:00:00", stops: 0, duration: "5h 30m", airline: "United", flight_number: "UA114" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  },
  {
    id: "13",
    trip_type: "one_way",
    price: "155.00",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-13",
    legs: [
      { origin: "SJC", destination: "LAX", departure_time: "2026-03-25T21:45:00", arrival_time: "2026-03-25T23:00:00", stops: 1, duration: "1h 15m", airline: "Delta", flight_number: "DL101" },
      { origin: "LAX", destination: "JFK", departure_time: "2026-03-26T00:15:00", arrival_time: "2026-03-26T08:30:00", stops: 0, duration: "5h 15m", airline: "Delta", flight_number: "DL990" }
    ],
    departure_leg: { 
      segments: [
        { origin: "SJC", destination: "LAX", departure_time: "2026-03-25T21:45:00", arrival_time: "2026-03-25T23:00:00", stops: 1, duration: "1h 15m", airline: "Delta", flight_number: "DL101" },
        { origin: "LAX", destination: "JFK", departure_time: "2026-03-26T00:15:00", arrival_time: "2026-03-26T08:30:00", stops: 0, duration: "5h 15m", airline: "Delta", flight_number: "DL990" }
      ], 
      total_stops: 1, duration: "7h 45m" 
    },
    return_leg: null
  },
  {
    id: "14",
    trip_type: "one_way",
    price: "148.50",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-14",
    legs: [
      { origin: "SJC", destination: "CLT", departure_time: "2026-03-25T22:30:00", arrival_time: "2026-03-26T06:00:00", stops: 1, duration: "4h 30m", airline: "American", flight_number: "AA701" },
      { origin: "CLT", destination: "EWR", departure_time: "2026-03-26T07:30:00", arrival_time: "2026-03-26T09:20:00", stops: 0, duration: "1h 50m", airline: "American", flight_number: "AA812" }
    ],
    departure_leg: { 
      segments: [
        { origin: "SJC", destination: "CLT", departure_time: "2026-03-25T22:30:00", arrival_time: "2026-03-26T06:00:00", stops: 1, duration: "4h 30m", airline: "American", flight_number: "AA701" },
        { origin: "CLT", destination: "EWR", departure_time: "2026-03-26T07:30:00", arrival_time: "2026-03-26T09:20:00", stops: 0, duration: "1h 50m", airline: "American", flight_number: "AA812" }
      ], 
      total_stops: 1, duration: "7h 50m" 
    },
    return_leg: null
  },
  {
    id: "15",
    trip_type: "one_way",
    price: "160.00",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/sjc-nyc-15",
    legs: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T23:45:00", arrival_time: "2026-03-26T08:15:00", stops: 0, duration: "5h 30m", airline: "Alaska", flight_number: "AS45" }],
    departure_leg: { segments: [{ origin: "SJC", destination: "JFK", departure_time: "2026-03-25T23:45:00", arrival_time: "2026-03-26T08:15:00", stops: 0, duration: "5h 30m", airline: "Alaska", flight_number: "AS45" }], total_stops: 0, duration: "5h 30m" },
    return_leg: null
  }
];