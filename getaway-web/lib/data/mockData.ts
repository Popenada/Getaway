import { Flight } from "@/lib/types";

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: "1",
    trip_type: "one_way",
    price: "128.50",
    currency: "USD",
    cabin: "Economy",
    booking_url: "https://example.com/book/1",
    legs: [{ origin: "SFO", destination: "LAX", departure_time: "2026-04-10T08:00:00", arrival_time: "2026-04-10T09:30:00", stops: 0, duration: "1h 30m", airline: "United", flight_number: "UA123" }],
    departure_leg: { segments: [{ origin: "SFO", destination: "LAX", departure_time: "2026-04-10T08:00:00", arrival_time: "2026-04-10T09:30:00", stops: 0, duration: "1h 30m", airline: "United", flight_number: "UA123" }], total_stops: 0, duration: "1h 30m" },
    return_leg: null
  },
  {
    id: "2", // STOPS: 1
    trip_type: "one_way",
    price: "342.00",
    currency: "USD",
    cabin: "Main Cabin",
    legs: [
      { origin: "SEA", destination: "DEN", departure_time: "2026-05-12T06:00:00", arrival_time: "2026-05-12T08:45:00", stops: 1, duration: "2h 45m", airline: "Delta", flight_number: "DL88" },
      { origin: "DEN", destination: "ATL", departure_time: "2026-05-12T10:15:00", arrival_time: "2026-05-12T15:30:00", stops: 0, duration: "3h 15m", airline: "Delta", flight_number: "DL92" }
    ],
    departure_leg: { 
      segments: [
        { origin: "SEA", destination: "DEN", departure_time: "2026-05-12T06:00:00", arrival_time: "2026-05-12T08:45:00", stops: 1, duration: "2h 45m", airline: "Delta", flight_number: "DL88" },
        { origin: "DEN", destination: "ATL", departure_time: "2026-05-12T10:15:00", arrival_time: "2026-05-12T15:30:00", stops: 0, duration: "3h 15m", airline: "Delta", flight_number: "DL92" }
      ], 
      total_stops: 1, duration: "9h 30m" 
    },
    return_leg: null
  },
  {
    id: "3",
    trip_type: "round_trip",
    price: "450.00",
    currency: "USD",
    cabin: "Economy",
    legs: [
      { origin: "LAX", destination: "JFK", departure_time: "2026-06-01T10:00:00", arrival_time: "2026-06-01T18:30:00", stops: 0, duration: "5h 30m", airline: "JetBlue", flight_number: "B6402" },
      { origin: "JFK", destination: "LAX", departure_time: "2026-06-08T14:00:00", arrival_time: "2026-06-08T17:15:00", stops: 0, duration: "6h 15m", airline: "JetBlue", flight_number: "B6403" }
    ],
    departure_leg: { segments: [{ origin: "LAX", destination: "JFK", departure_time: "2026-06-01T10:00:00", arrival_time: "2026-06-01T18:30:00", stops: 0, duration: "5h 30m", airline: "JetBlue", flight_number: "B6402" }], total_stops: 0, duration: "5h 30m" },
    return_leg: { segments: [{ origin: "JFK", destination: "LAX", departure_time: "2026-06-08T14:00:00", arrival_time: "2026-06-08T17:15:00", stops: 0, duration: "6h 15m", airline: "JetBlue", flight_number: "B6403" }], total_stops: 0, duration: "6h 15m" }
  },
  {
    id: "4", // STOPS: 2
    trip_type: "one_way",
    price: "510.25",
    currency: "USD",
    cabin: "Economy",
    legs: [
      { origin: "SJC", destination: "PHX", departure_time: "2026-06-15T07:00:00", arrival_time: "2026-06-15T08:30:00", stops: 2, duration: "1h 30m", airline: "Southwest", flight_number: "WN10" },
      { origin: "PHX", destination: "DAL", departure_time: "2026-06-15T10:00:00", arrival_time: "2026-06-15T12:30:00", stops: 1, duration: "2h 30m", airline: "Southwest", flight_number: "WN11" },
      { origin: "DAL", destination: "HOU", departure_time: "2026-06-15T14:00:00", arrival_time: "2026-06-15T15:00:00", stops: 0, duration: "1h 00m", airline: "Southwest", flight_number: "WN12" }
    ],
    departure_leg: { segments: [
      { origin: "SJC", destination: "PHX", departure_time: "2026-06-15T07:00:00", arrival_time: "2026-06-15T08:30:00", stops: 2, duration: "1h 30m", airline: "Southwest", flight_number: "WN10" },
      { origin: "PHX", destination: "DAL", departure_time: "2026-06-15T10:00:00", arrival_time: "2026-06-15T12:30:00", stops: 1, duration: "2h 30m", airline: "Southwest", flight_number: "WN11" },
      { origin: "DAL", destination: "HOU", departure_time: "2026-06-15T14:00:00", arrival_time: "2026-06-15T15:00:00", stops: 0, duration: "1h 00m", airline: "Southwest", flight_number: "WN12" }
    ], total_stops: 2, duration: "8h 00m" },
    return_leg: null
  },
  {
    id: "5",
    trip_type: "round_trip",
    price: "1150.00",
    currency: "USD",
    cabin: "Business",
    legs: [
      { origin: "SFO", destination: "HND", departure_time: "2026-07-20T11:00:00", arrival_time: "2026-07-21T14:00:00", stops: 0, duration: "11h 00m", airline: "ANA", flight_number: "NH107" },
      { origin: "HND", destination: "SFO", departure_time: "2026-07-28T22:00:00", arrival_time: "2026-07-28T16:00:00", stops: 0, duration: "10h 00m", airline: "ANA", flight_number: "NH108" }
    ],
    departure_leg: { segments: [{ origin: "SFO", destination: "HND", departure_time: "2026-07-20T11:00:00", arrival_time: "2026-07-21T14:00:00", stops: 0, duration: "11h 00m", airline: "ANA", flight_number: "NH107" }], total_stops: 0, duration: "11h 00m" },
    return_leg: { segments: [{ origin: "HND", destination: "SFO", departure_time: "2026-07-28T22:00:00", arrival_time: "2026-07-28T16:00:00", stops: 0, duration: "10h 00m", airline: "ANA", flight_number: "NH108" }], total_stops: 0, duration: "10h 00m" }
  },
  {
    id: "6", // STOPS: 3 (Long Haul Complex)
    trip_type: "one_way",
    price: "890.75",
    currency: "USD",
    cabin: "Economy",
    legs: [
      { origin: "LAX", destination: "LHR", departure_time: "2026-08-01T18:00:00", arrival_time: "2026-08-02T12:00:00", stops: 3, duration: "10h 00m", airline: "Virgin Atlantic", flight_number: "VS8" },
      { origin: "LHR", destination: "DXB", departure_time: "2026-08-02T15:00:00", arrival_time: "2026-08-03T01:00:00", stops: 2, duration: "7h 00m", airline: "Emirates", flight_number: "EK2" },
      { origin: "DXB", destination: "BKK", departure_time: "2026-08-03T04:00:00", arrival_time: "2026-08-03T13:30:00", stops: 1, duration: "6h 30m", airline: "Emirates", flight_number: "EK376" },
      { origin: "BKK", destination: "CNX", departure_time: "2026-08-03T16:00:00", arrival_time: "2026-08-03T17:15:00", stops: 0, duration: "1h 15m", airline: "Thai Airways", flight_number: "TG116" }
    ],
    departure_leg: { segments: [
      { origin: "LAX", destination: "LHR", departure_time: "2026-08-01T18:00:00", arrival_time: "2026-08-02T12:00:00", stops: 3, duration: "10h 00m", airline: "Virgin Atlantic", flight_number: "VS8" },
      { origin: "LHR", destination: "DXB", departure_time: "2026-08-02T15:00:00", arrival_time: "2026-08-03T01:00:00", stops: 2, duration: "7h 00m", airline: "Emirates", flight_number: "EK2" },
      { origin: "DXB", destination: "BKK", departure_time: "2026-08-03T04:00:00", arrival_time: "2026-08-03T13:30:00", stops: 1, duration: "6h 30m", airline: "Emirates", flight_number: "EK376" },
      { origin: "BKK", destination: "CNX", departure_time: "2026-08-03T16:00:00", arrival_time: "2026-08-03T17:15:00", stops: 0, duration: "1h 15m", airline: "Thai Airways", flight_number: "TG116" }
    ], total_stops: 3, duration: "23h 15m" },
    return_leg: null
  },
  {
    id: "7",
    trip_type: "one_way",
    price: "195.00",
    currency: "USD",
    cabin: "Economy",
    legs: [{ origin: "JFK", destination: "MIA", departure_time: "2026-09-10T11:00:00", arrival_time: "2026-09-10T14:15:00", stops: 0, duration: "3h 15m", airline: "American", flight_number: "AA221" }],
    departure_leg: { segments: [{ origin: "JFK", destination: "MIA", departure_time: "2026-09-10T11:00:00", arrival_time: "2026-09-10T14:15:00", stops: 0, duration: "3h 15m", airline: "American", flight_number: "AA221" }], total_stops: 0, duration: "3h 15m" },
    return_leg: null
  },
  {
    id: "8", // STOPS: 1
    trip_type: "round_trip",
    price: "720.50",
    currency: "USD",
    cabin: "Premium Economy",
    legs: [
      { origin: "DFW", destination: "MEX", departure_time: "2026-10-05T09:00:00", arrival_time: "2026-10-05T11:30:00", stops: 1, duration: "2h 30m", airline: "AeroMexico", flight_number: "AM401" },
      { origin: "MEX", destination: "CUN", departure_time: "2026-10-05T14:00:00", arrival_time: "2026-10-05T16:15:00", stops: 0, duration: "2h 15m", airline: "AeroMexico", flight_number: "AM520" },
      { origin: "CUN", destination: "DFW", departure_time: "2026-10-12T17:00:00", arrival_time: "2026-10-12T19:45:00", stops: 0, duration: "2h 45m", airline: "AeroMexico", flight_number: "AM521" }
    ],
    departure_leg: { segments: [
      { origin: "DFW", destination: "MEX", departure_time: "2026-10-05T09:00:00", arrival_time: "2026-10-05T11:30:00", stops: 1, duration: "2h 30m", airline: "AeroMexico", flight_number: "AM401" },
      { origin: "MEX", destination: "CUN", departure_time: "2026-10-05T14:00:00", arrival_time: "2026-10-05T16:15:00", stops: 0, duration: "2h 15m", airline: "AeroMexico", flight_number: "AM520" }
    ], total_stops: 1, duration: "7h 15m" },
    return_leg: { segments: [{ origin: "CUN", destination: "DFW", departure_time: "2026-10-12T17:00:00", arrival_time: "2026-10-12T19:45:00", stops: 0, duration: "2h 45m", airline: "AeroMexico", flight_number: "AM521" }], total_stops: 0, duration: "2h 45m" }
  },
  {
    id: "9",
    trip_type: "one_way",
    price: "85.00",
    currency: "USD",
    cabin: "Economy",
    legs: [{ origin: "LAS", destination: "PHX", departure_time: "2026-11-20T20:00:00", arrival_time: "2026-11-20T21:10:00", stops: 0, duration: "1h 10m", airline: "Frontier", flight_number: "F922" }],
    departure_leg: { segments: [{ origin: "LAS", destination: "PHX", departure_time: "2026-11-20T20:00:00", arrival_time: "2026-11-20T21:10:00", stops: 0, duration: "1h 10m", airline: "Frontier", flight_number: "F922" }], total_stops: 0, duration: "1h 10m" },
    return_leg: null
  },
  {
    id: "10", // STOPS: 1
    trip_type: "round_trip",
    price: "930.00",
    currency: "USD",
    cabin: "Economy",
    legs: [
      { origin: "BOS", destination: "YYZ", departure_time: "2026-12-15T08:00:00", arrival_time: "2026-12-15T09:45:00", stops: 1, duration: "1h 45m", airline: "Air Canada", flight_number: "AC7631" },
      { origin: "YYZ", destination: "YVR", departure_time: "2026-12-15T11:30:00", arrival_time: "2026-12-15T13:45:00", stops: 0, duration: "5h 15m", airline: "Air Canada", flight_number: "AC105" },
      { origin: "YVR", destination: "BOS", departure_time: "2026-12-22T10:00:00", arrival_time: "2026-12-22T18:15:00", stops: 0, duration: "5h 15m", airline: "Air Canada", flight_number: "AC106" }
    ],
    departure_leg: { segments: [
      { origin: "BOS", destination: "YYZ", departure_time: "2026-12-15T08:00:00", arrival_time: "2026-12-15T09:45:00", stops: 1, duration: "1h 45m", airline: "Air Canada", flight_number: "AC7631" },
      { origin: "YYZ", destination: "YVR", departure_time: "2026-12-15T11:30:00", arrival_time: "2026-12-15T13:45:00", stops: 0, duration: "5h 15m", airline: "Air Canada", flight_number: "AC105" }
    ], total_stops: 1, duration: "5h 45m" },
    return_leg: { segments: [{ origin: "YVR", destination: "BOS", departure_time: "2026-12-22T10:00:00", arrival_time: "2026-12-22T18:15:00", stops: 0, duration: "5h 15m", airline: "Air Canada", flight_number: "AC106" }], total_stops: 0, duration: "5h 15m" }
  },
  {
    id: "11", // Edge Case: 6 Stops (Testing Horizontal Overflow)
    trip_type: "one_way",
    price: "1540.00",
    currency: "USD",
    cabin: "Economy",
    legs: [
      { origin: "SYD", destination: "SIN", departure_time: "2026-05-15T10:00:00", arrival_time: "2026-05-15T16:00:00", stops: 6, duration: "8h 00m", airline: "Singapore Air", flight_number: "SQ232" },
      { origin: "SIN", destination: "BKK", departure_time: "2026-05-15T19:00:00", arrival_time: "2026-05-15T20:30:00", stops: 5, duration: "2h 30m", airline: "Singapore Air", flight_number: "SQ714" },
      { origin: "BKK", destination: "HKG", departure_time: "2026-05-16T02:00:00", arrival_time: "2026-05-16T05:50:00", stops: 4, duration: "2h 50m", airline: "Cathay Pacific", flight_number: "CX700" },
      { origin: "HKG", destination: "TPE", departure_time: "2026-05-16T09:00:00", arrival_time: "2026-05-16T10:55:00", stops: 3, duration: "1h 55m", airline: "Cathay Pacific", flight_number: "CX494" },
      { origin: "TPE", destination: "NRT", departure_time: "2026-05-16T13:00:00", arrival_time: "2026-05-16T17:20:00", stops: 2, duration: "3h 20m", airline: "Japan Airlines", flight_number: "JL802" },
      { origin: "NRT", destination: "HEL", departure_time: "2026-05-16T23:00:00", arrival_time: "2026-05-17T05:00:00", stops: 1, duration: "13h 00m", airline: "Finnair", flight_number: "AY74" },
      { origin: "HEL", destination: "LHR", departure_time: "2026-05-17T08:00:00", arrival_time: "2026-05-17T09:10:00", stops: 0, duration: "3h 10m", airline: "Finnair", flight_number: "AY1331" }
    ],
    departure_leg: {
      segments: [
        { origin: "SYD", destination: "SIN", departure_time: "2026-05-15T10:00:00", arrival_time: "2026-05-15T16:00:00", stops: 6, duration: "8h 00m", airline: "Singapore Air", flight_number: "SQ232" },
        { origin: "SIN", destination: "BKK", departure_time: "2026-05-15T19:00:00", arrival_time: "2026-05-15T20:30:00", stops: 5, duration: "2h 30m", airline: "Singapore Air", flight_number: "SQ714" },
        { origin: "BKK", destination: "HKG", departure_time: "2026-05-16T02:00:00", arrival_time: "2026-05-16T05:50:00", stops: 4, duration: "2h 50m", airline: "Cathay Pacific", flight_number: "CX700" },
        { origin: "HKG", destination: "TPE", departure_time: "2026-05-16T09:00:00", arrival_time: "2026-05-16T10:55:00", stops: 3, duration: "1h 55m", airline: "Cathay Pacific", flight_number: "CX494" },
        { origin: "TPE", destination: "NRT", departure_time: "2026-05-16T13:00:00", arrival_time: "2026-05-16T17:20:00", stops: 2, duration: "3h 20m", airline: "Japan Airlines", flight_number: "JL802" },
        { origin: "NRT", destination: "HEL", departure_time: "2026-05-16T23:00:00", arrival_time: "2026-05-17T05:00:00", stops: 1, duration: "13h 00m", airline: "Finnair", flight_number: "AY74" },
        { origin: "HEL", destination: "LHR", departure_time: "2026-05-17T08:00:00", arrival_time: "2026-05-17T09:10:00", stops: 0, duration: "3h 10m", airline: "Finnair", flight_number: "AY1331" }
      ],
      total_stops: 6,
      duration: "47h 10m"
    },
    return_leg: null
  }
];