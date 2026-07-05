import os 
import requests

BASE_URL = "https://api.duffel.com"

def _headers():
    return {
        "Authorization": f"Bearer {os.environ['DUFFEL_API_KEY']}",
        "Duffel-Version": "v2",
        "Accept": "application/json",
    }

def get_place_suggestions(query=None, lat=None, lng=None, rad=None):
    params = {}
    if query is not None: params["query"] = query
    if lat is not None: params["lat"] = lat
    if lng is not None: params["lng"] = lng
    if rad is not None: params["rad"] = rad

    response = requests.get(
        f"{BASE_URL}/places/suggestions",
        params=params,
        headers=_headers(),
    )
    response.raise_for_status()
    return response.json()["data"]