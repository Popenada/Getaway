import { ProcessedFlight } from "./types";

// export const groupDate =
// 1. Add explicit return type and change [] to {}
export const groupPrice = (data: ProcessedFlight[]): Record<string, ProcessedFlight[]> => {
  if (data.length === 0) return {}; // Marker: Changed from []
  
  const sortedPrices = data.map(f => parseFloat(f.price)).sort((a, b) => a - b);
  const numBuckets = 5;
  
  const thresholds = Array.from({ length: numBuckets - 1 }, (_, i) => {
    const idx = Math.floor(((i + 1) / numBuckets) * sortedPrices.length);
    const priceAtVal = sortedPrices[idx] ?? sortedPrices[sortedPrices.length - 1];
    return Math.ceil(priceAtVal / 50) * 50;
  });

  return data.reduce((acc, flight) => {
    const p = parseFloat(flight.price);
    const bucketIdx = thresholds.findIndex(t => p < t);
    const label = bucketIdx === -1 
      ? `$${thresholds[thresholds.length - 1]}+` 
      : `Under $${thresholds[bucketIdx]}`;

    if (!acc[label]) acc[label] = [];
    acc[label].push(flight);
    return acc;
  }, {} as Record<string, ProcessedFlight[]>);
};

// 2. Add explicit return type here as well
export const groupDate = (data: ProcessedFlight[]): Record<string, ProcessedFlight[]> => {
  if (data.length === 0) return {}; // Marker: Added early return {}
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return data.reduce((acc, flight) => {
    const depDate = new Date(flight.departure_leg.segments[0].departure_time);
    depDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((depDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let label = "";

    if (diffDays === 0) label = "Today";
    else if (diffDays === 1) label = "Tomorrow";
    else if (diffDays < 7) label = depDate.toLocaleDateString('en-US', { weekday: 'long' });
    else if (diffDays < 30) {
      const weekNum = Math.ceil(diffDays / 7);
      label = `In ${weekNum} Weeks`;
    } else {
      label = depDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    if (!acc[label]) acc[label] = [];
    acc[label].push(flight);
    return acc;
  }, {} as Record<string, ProcessedFlight[]>);
};

export function groupData(
  data: ProcessedFlight[],
  mode: 'price' | 'date' | 'dest'
): Array<{ label: string; flights: ProcessedFlight[] }> {
  // Initialize as an empty object to avoid the 'never[]' error
  let groupedObj: Record<string, ProcessedFlight[]> = {};

  if (data.length === 0) return [];

  if (mode === 'price') {
    groupedObj = groupPrice(data);
  } else if (mode === 'date') {
    groupedObj = groupDate(data);
  } else {
    groupedObj = data.reduce((acc, f) => {
      // Access the destination of the final leg in the departure segment
      const lastLeg = f.departure_leg.segments[f.departure_leg.segments.length - 1];
      const key = lastLeg?.destination || "Unknown";
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(f);
      return acc;
    }, {} as Record<string, ProcessedFlight[]>);
  }

  return Object.entries(groupedObj).map(([label, flights]) => ({
    label,
    flights
  }));
}