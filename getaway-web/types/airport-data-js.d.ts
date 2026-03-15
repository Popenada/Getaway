declare module "airport-data-js" {
  export interface Airport {
    iata: string;
    icao: string;
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
    continent: string;
    type: string;
    [key: string]: any;
  }

  export function getAirportByIata(iataCode: string): Promise<Airport[]>;

  export function getAirportByIcao(icaoCode: string): Promise<Airport[]>;

  export function searchByName(query: string): Promise<Airport[]>;

  export function getAirportsByTimezone(timezone: string): Promise<Airport[]>;
}