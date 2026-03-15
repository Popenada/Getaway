import json
import urllib.parse
from typing import List, Dict, Any
import hashlib
from datetime import datetime

_generated_ids = set()

def load_json_response(file_path: str) -> Dict[str, Any]:
    with open(file_path, 'r') as file:
        return json.load(file)

def get_trip_type(itineraries: List[Dict]) -> str:
    if len(itineraries) == 1:
        return "one_way"
    first_origin = itineraries[0]['segments'][0]['departure']['iataCode']
    last_dest = itineraries[-1]['segments'][-1]['arrival']['iataCode']
    return 'round_trip' if first_origin == last_dest else 'multi_city'

def get_stop_count(segments: List[Dict]) -> int:
    connections = len(segments) - 1
    technical = sum(s['numberOfStops'] for s in segments)
    return connections + technical

def generate_flight_id(offer: Dict, legs: List[Dict], passengers: int) -> str:
    first_seg = legs[0]['segments'][0]
    last_seg = legs[-1]['segments'][-1]
    
    key = (
        f"{offer['id']}"
        f"{first_seg['origin']}"
        f"{last_seg['destination']}"
        f"{first_seg['departure_time']}"
        f"{last_seg['arrival_time']}"
        f"{offer['price']['total']}"
        f"{offer['price']['currency']}"
        f"{'_'.join(seg['flight_number'] for leg in legs for seg in leg['segments'])}"
        f"{offer['travelerPricings'][0]['fareDetailsBySegment'][0]['cabin']}"
        f"{passengers}"
    )
    
    flight_id = hashlib.sha256(key.encode()).hexdigest()
    
    curr = flight_id
    counter = 1
    while curr in _generated_ids:
        curr = f"{flight_id}_{counter}"
        counter += 1
    
    _generated_ids.add(curr)
    return curr

def build_google_flights_url(legs: List[Dict], cabin_clss=None, adults=1) -> str:
    first_seg = legs[0]['segments'][0]
    last_seg = legs[0]['segments'][-1]
    origin = first_seg['origin']
    destination = last_seg['destination']
    dep_date = first_seg['departure_time'].split('T')[0]
    ret_date = legs[-1]['segments'][0]['departure_time'].split('T')[0] if len(legs) > 1 else None
    
    query = f"flights from {origin} to {destination} on {dep_date}"
    if ret_date:
        query += f" returning {ret_date}"
    query += f" with {adults} adult{'s' if adults > 1 else ''}"
    if cabin_clss:
        query += f" in {cabin_clss} class"

    encoded_query = urllib.parse.quote(query)
    
    return f"https://www.google.com/flights?q={encoded_query}"

def parse_flights(searchid: str, passengers: int, response_data: Dict[str, Any], write_to_file=False) -> List[Dict[str, Any]]:
    flights = []
    data = response_data.get('data', [])
    carriers = response_data.get('dictionaries', {}).get('carriers', {})
    
    for offer in data:
        itineraries = offer.get('itineraries', [])
        
        legs = []
        legs_temp = [] # old
        for itinerary in itineraries:
            itinerary_legs = []
            for segment in itinerary['segments']:
                airline_code = segment['carrierCode']
                itinerary_legs.append({
                    'origin': segment['departure']['iataCode'],
                    'destination': segment['arrival']['iataCode'],
                    'departure_time': segment['departure']['at'],
                    'arrival_time': segment['arrival']['at'],
                    'stops': get_stop_count([segment]),
                    'duration': segment.get('duration', calculate_duration(segment['departure']['at'],segment['arrival']['at'])),
                    'airline': carriers.get(airline_code, airline_code),
                    'flight_number': f"{airline_code}{segment['number']}"
                })
                # old implementation -----
                legs_temp.append({
                    'origin': segment['departure']['iataCode'],
                    'destination': segment['arrival']['iataCode'],
                    'departure_time': segment['departure']['at'],
                    'arrival_time': segment['arrival']['at'],
                    'stops': get_stop_count([segment]),
                    'duration': segment.get('duration', calculate_duration(segment['departure']['at'],segment['arrival']['at'])),
                    'airline': carriers.get(airline_code, airline_code),
                    'flight_number': f"{airline_code}{segment['number']}"
                }) # -----
            legs.append({
                'segments': itinerary_legs,
                'total_stops': get_stop_count(itinerary['segments']),
                'duration': itinerary['duration'],
            })
        
        flight_obj = {
            'id': generate_flight_id(offer, legs, passengers),
            'trip_type': get_trip_type(itineraries),
            'legs': legs_temp, # old
            'departure_leg': legs[0],
            'return_leg': legs[-1] if len(legs) > 1 else None,
            'price': offer['price']['total'],
            'currency': offer['price']['currency'],
            'cabin': offer['travelerPricings'][0]['fareDetailsBySegment'][0]['cabin'],
            'booking_url': build_google_flights_url(
                legs,
                cabin_clss=offer['travelerPricings'][0]['fareDetailsBySegment'][0]['cabin'],
                adults=passengers
                )
        }
        
        flights.append(flight_obj)
    
    if (write_to_file):
        f = "%s-parsed.json" %searchid
        with open(f, "w") as file:
            file.write(json.dumps(flights, indent=2))
    
    return flights

def calculate_duration(departure_str: str, arrival_str: str) -> str:
    fmt = "%Y-%m-%dT%H:%M:%S"
    try:
        dep = datetime.strptime(departure_str, fmt)
        arr = datetime.strptime(arrival_str, fmt)
        diff = arr - dep
        hours, remainder = divmod(diff.total_seconds(), 3600)
        minutes, _ = divmod(remainder, 60)
        return f"PT{int(hours)}H{int(minutes)}M"
    except (ValueError, TypeError):
        return "N/A"

'''
if __name__ == '__main__':
    data = load_json_response('TEST123.json')
    parse_flights('TEST123', 1, data, True)
'''