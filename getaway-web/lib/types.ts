// Data structure to parse into results history
export type SearchHistoryEntry = {
  id: string;
  timestamp: number;
  query: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
  };
  resultCount: number;
};