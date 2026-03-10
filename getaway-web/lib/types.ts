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
};

export type Flight = { 
  legs: Leg[]; 
  price: string; 
  currency: string; 
  cabin: string; 
  booking_url?: string;
};