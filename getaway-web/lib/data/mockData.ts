import { Flight } from "@/lib/types"; // Adjust path to your types file

export const MOCK_FLIGHTS: Flight[] = [
  {
    "legs": [
      {
        "origin": "SFO",
        "destination": "LAX",
        "departure_time": "2026-04-10T08:00:00",
        "arrival_time": "2026-04-10T09:30:00",
        "stops": 0,
        "duration": "1h 30m",
        "airline": "United"
      }
    ],
    "price": "120.00",
    "currency": "USD",
    "cabin": "Economy",
    "booking_url": "https://example.com/book/1"
  },
  {
    "legs": [
      {
        "origin": "LAX",
        "destination": "JFK",
        "departure_time": "2026-05-01T10:00:00",
        "arrival_time": "2026-05-01T18:30:00",
        "stops": 0,
        "duration": "5h 30m",
        "airline": "JetBlue"
      },
      {
        "origin": "JFK",
        "destination": "LAX",
        "departure_time": "2026-05-08T14:00:00",
        "arrival_time": "2026-05-08T17:15:00",
        "stops": 0,
        "duration": "6h 15m",
        "airline": "JetBlue"
      }
    ],
    "price": "450.00",
    "currency": "USD",
    "cabin": "Economy",
    "booking_url": "https://example.com/book/1"
  },
  {
    "legs": [
      {
        "origin": "SEA",
        "destination": "ORD",
        "departure_time": "2026-06-12T06:00:00",
        "arrival_time": "2026-06-12T12:00:00",
        "stops": 1,
        "duration": "4h 00m",
        "airline": "American"
      },
      {
        "origin": "ORD",
        "destination": "LGA",
        "departure_time": "2026-06-12T14:30:00",
        "arrival_time": "2026-06-12T17:45:00",
        "stops": 0,
        "duration": "2h 15m",
        "airline": "American"
      }
    ],
    "price": "310.50",
    "currency": "USD",
    "cabin": "Main Cabin",
    "booking_url": "https://example.com/book/1"
  },
  {
    "legs": [
      {
        "origin": "SJC",
        "destination": "DEN",
        "departure_time": "2026-07-20T07:00:00",
        "arrival_time": "2026-07-20T10:30:00",
        "stops": 2,
        "duration": "2h 30m",
        "airline": "Southwest"
      },
      {
        "origin": "DEN",
        "destination": "STL",
        "departure_time": "2026-07-20T12:00:00",
        "arrival_time": "2026-07-20T15:00:00",
        "stops": 1,
        "duration": "2h 00m",
        "airline": "Southwest"
      },
      {
        "origin": "STL",
        "destination": "BWI",
        "departure_time": "2026-07-20T16:30:00",
        "arrival_time": "2026-07-20T19:45:00",
        "stops": 0,
        "duration": "2h 15m",
        "airline": "Southwest"
      },
      {
        "origin": "BWI",
        "destination": "LAS",
        "departure_time": "2026-07-27T09:00:00",
        "arrival_time": "2026-07-27T11:30:00",
        "stops": 1,
        "duration": "5h 30m",
        "airline": "Southwest"
      },
      {
        "origin": "LAS",
        "destination": "SJC",
        "departure_time": "2026-07-27T13:00:00",
        "arrival_time": "2026-07-27T14:30:00",
        "stops": 0,
        "duration": "1h 30m",
        "airline": "Southwest"
      }
    ],
    "price": "680.20",
    "currency": "USD",
    "cabin": "Economy",
    "booking_url": "https://example.com/book/1"
  }
];