import json
from typing import List, Dict, Any
from app import app

def load_json_response(file_path: str) -> Dict[str, Any]:
    with open(file_path, 'r') as file:
        return json.load(file)

def parse_flights(response_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    flights = []
    
    data = response_data.get('data', [])
    carriers = response_data.get('dictionaries', {}).get('carriers', {})
    
    for offer in data:
        itinerary = offer['itineraries'][0]
        segments = itinerary['segments']
        
        first_seg = segments[0]
        last_seg = segments[-1]
        
        airline_code = first_seg['carrierCode']
        airline_name = carriers.get(airline_code, airline_code)
        
        flight_obj = {
            'origin': first_seg['departure']['iataCode'],
            'destination': last_seg['arrival']['iataCode'],
            'detparture_time': first_seg['departure']['at'],
            'arrival_time': last_seg['arrival']['at'],
            'stops': len(segments) - 1,
            'duration': itinerary['duration'],
            'airline': airline_name,
            'price': offer['price']['total'],
            'currency': offer['price']['currency'],
            'cabin': offer['travelerPricings'][0]['fareDetailsBySegment'][0]['cabin']
        }
        
        flights.append(flight_obj)
    
    return flights
