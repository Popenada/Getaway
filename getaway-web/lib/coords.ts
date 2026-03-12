export async function getCoordsFromCity(city: string) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "GetawayFlightSearch/1.0",
        },
      }
    );
    const data = await res.json();

    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        name: data[0].display_name.split(",")[0], 
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}