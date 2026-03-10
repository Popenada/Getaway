import os
import time
from flask import Flask, Blueprint, request, jsonify
from amadeus import Client, ResponseError

amadeus = Client(
    client_id = os.environ.get("AMADEUS_API_KEY"),
    client_secret = os.environ.get("AMADEUS_API_SECRET")
)

cache = {}
CACHE_DURATION = 5 * 60 # 5 minutes

def first_letter_upper(s: str) -> str:
    return " ".join(word.capitalize() for word in s.lower().split())

def get_locations(query: str):    
    if (len(query) < 2): return jsonify([])
    
    cached = cache.get(query)
    if cached and (time.time() - cached["timestamp"] < CACHE_DURATION):
        return jsonify(cached["data"])
    
    try:
        response = amadeus.reference_data.locations.get(
            keyword = query,
            subType = "AIRPORT,CITY",
            page = {"limit": 10},
        )
        
        results = [
            {
                "label": f"{first_letter_upper(loc['name'])}",
                "code": loc["iataCode"],
                "city": loc.get("address", {}).get("cityName"),
                "country": loc.get("address", {}).get("countryName"),
                "type": loc["subType"],
            }
            for loc in response.data
        ]
        
        cache[query] = {"data": results, "timestamp": time.time()}
        return jsonify(results)
    
    except ResponseError as e:
        if e.response.status_code == 429:
            return jsonify({"error": "Amadeus API rate limit exceeded"}), 429
        return jsonify({"error": "Failed to fetch locations"}), 500