// Data structure to parse into results history
export type SearchHistoryEntry = {
  id: string;
  timestamp: number;
  query: {
    origins: Array<{ label: string; code: string }>;
    destinations: Array<{ label: string; code: string }>;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    roundTrip?: boolean;
    tripLength?: number;
    includedAirline?: string[];
    excludedAirline?: string[];
    nonstopOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    departureWindow?: number;
    returnWindow?: number;
  };
  resultCount: number;
};

export type Leg = { 
  origin: string; 
  destination: string; 
  departure_time: string; 
  arrival_time: string; 
  stops: number; 
  duration: string; 
  airline: string; 
  flight_number: string;
};

export type Segment = {
  segments?: Leg[];
  total_stops?: number;
  duration?: string;
}

export type Flight = { 
  trip_type?: string;
  legs: Leg[]; 
  departure_leg: Segment;
  return_leg: Segment | null;
  price: string; 
  currency: string; 
  cabin: string; 
  booking_url?: string;
};