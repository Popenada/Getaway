import { NextResponse } from "next/server";
import Amadeus from "amadeus-ts";

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY!,
    clientSecret: process.env.AMADEUS_API_SECRET!,
});

function firstLetterUpper(str: string) {
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

const cache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    const cached = cache.get(query);

    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        return NextResponse.json(cached.data);
    }

    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: query,
            subType: "AIRPORT,CITY",
            page: { limit: 10 },
        });

        const results = response.data.map((location: any) => ({
            label: `${firstLetterUpper(location.name)} (${location.iataCode})`,
            code: location.iataCode,
            city: location.address?.cityName,
            country: location.address?.countryName,
            type: location.subType,
        }));

        cache.set(query, {
            data: results,
            timestamp: Date.now(),
        });

        return NextResponse.json(results);

    } catch (error: any) {
        console.error(error);

        if (error.response?.statusCode == 429) {
            return NextResponse.json(
                { error: "Amadeus API rate limit exceeded" },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch locations" },
            { status: 500 }
        );
    } 
}