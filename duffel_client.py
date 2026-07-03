import os 
import requests

BASE_URL = "https://api.duffel.com"

def _headers():
    return {
        "Authorization": f"Bearer {os.environ['DUFFEL_API_KEY']}",
        "Duffel-Version": "v2",
        "Accept": "application/json",
    }

def get_place_suggestions(query):
    response = requests.get(
        f"{BASE_URL}/places/suggestions",
        params={"query": query},
        headers=_headers(),
    )
    response.raise_for_status()
    return response.json()["data"]