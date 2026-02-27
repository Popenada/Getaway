import json
from typing import List, Dict, Any
from app import app

def load_json_response(file_path: str) -> Dict[str, Any]:
    with open(file_path, 'r') as file:
        return json.load(file)

def parse_flights(searchid: str, response_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    flights = []
    
    data = response_data.get('data', [])
    carriers = response_data.get('dictionaries', {}).get('carriers', {})
    
    for offer in data:
        legs = []
        
        for itinerary in offer.get('itineraries', []):
            segments = itinerary['segments']
            
            for segment in segments:
                airline_code = segment['carrierCode']
                airline_name = carriers.get(airline_code, airline_code)
    
                leg = {
                    'origin': segment['departure']['iataCode'],
                    'destination': segment['arrival']['iataCode'],
                    'departure_time': segment['departure']['at'],
                    'arrival_time': segment['arrival']['at'],
                    'stops': 0 if segment['numberOfStops'] == 0 else segment['numberOfStops'],
                    'duration': segment['duration'],
                    'airline': airline_name,
                    'flight_number': f"{segment['carrierCode']}{segment['number']}"
                }
                
                legs.append(leg)
        
        flight_obj = {
            'legs': legs,
            'price': offer['price']['total'],
            'currency': offer['price']['currency'],
            'cabin': offer['travelerPricings'][0]['fareDetailsBySegment'][0]['cabin']
        }
        
        flights.append(flight_obj)
    
    f = "%s-parsed.json" %searchid
    with open(f, "w") as file:
        file.write(json.dumps(flights, indent=2))
    
    return flights