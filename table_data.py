import json
import urllib.parse
from typing import List, Dict, Any
from app import app

def load_json_response(file_path: str) -> Dict[str, Any]:
    with open(file_path, 'r') as file:
        return json.load(file)

def build_google_flights_url(origin, destination, departure_time, return_time=None) -> str:
    dep_date = departure_time.split('T')[0]
    ret_date = return_time.split('T')[0] if return_time else None
    
    query = f"flights from {origin} to {destination} on {dep_date}"
    if ret_date:
        query += f" returning {ret_date}"
    
    encoded_query = urllib.parse.quote(query)
    
    return f"https://www.google.com/flights?q={encoded_query}"

def parse_flights(searchid: str, response_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    flights = []
    data = response_data.get('data', [])
    carriers = response_data.get('dictionaries', {}).get('carriers', {})
    
    for offer in data:
        legs = []
        itineraries = offer.get('itineraries', [])
        
        first_segment = itineraries[0]['segments'][0]
        last_segment = itineraries[-1]['segments'][-1]
        
        origin_iata = first_segment['departure']['iataCode']
        dest_iata = last_segment['departure']['iataCode']
        dep_time = first_segment['departure']['at']
        ret_time = last_segment['departure']['at']
        
        for itinerary in offer.get('itineraries', []):
            for segment in itinerary['segments']:
                airline_code = segment['carrierCode']
                legs.append({
                    'origin': segment['departure']['iataCode'],
                    'destination': segment['arrival']['iataCode'],
                    'departure_time': segment['departure']['at'],
                    'arrival_time': segment['arrival']['at'],
                    'stops': 0 if segment['numberOfStops'] == 0 else segment['numberOfStops'],
                    'duration': segment['duration'],
                    'airline': carriers.get(airline_code, airline_code),
                    'flight_number': f"{airline_code}{segment['number']}"
                })
        
        flight_obj = {
            'legs': legs,
            'price': offer['price']['total'],
            'currency': offer['price']['currency'],
            'cabin': offer['travelerPricings'][0]['fareDetailsBySegment'][0]['cabin'],
            'booking_url': build_google_flights_url(origin_iata, dest_iata, dep_time, ret_time)
        }
        
        flights.append(flight_obj)
    
    f = "%s-parsed.json" %searchid
    with open(f, "w") as file:
        file.write(json.dumps(flights, indent=2))
    
    return flights

'''
if __name__ == '__main__':
    data = load_json_response('TEST123.json')
    parse_flights('TEST123', data)
'''