import os
import time
from flask import Flask, Blueprint, request, jsonify
from requests import HTTPError
from duffel_client import get_place_suggestions


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
        places = get_place_suggestions(query)
        
        results = [
            {
                "label": first_letter_upper(place["name"]),
                "code": place["iata_code"],
                "city": place.get("city_name"),
                "country": place.get("iata_country_code"),
                "type": place["type"],
            }
            for place in places
        ]
        
        cache[query] = {"data": results, "timestamp": time.time()}
        return jsonify(results)
    
    except HTTPError as e:
        if e.response.status_code == 429:
            return jsonify({"error": "Duffel API rate limit exceeded"}), 429
        return jsonify({"error": "Failed to fetch locations"}), 500