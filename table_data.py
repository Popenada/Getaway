from flask import jsonify
import pandas as pd
import json
from typing import List, Dict, Any
from app import app

# Search request handler
# Access api and return result
# returns all tickets within criteria as well as all vendors. Only add best vendor link to table

#pd.set_option('display.max_columns', None)
#pd.set_option('display.max_rows', None)

def load_json_response(filepath: str) -> Dict[str, Any]:
    with open(filepath, 'r') as f:
        return json.load(f)

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
'''
def flights_to_dataframe(flights: List[Dict[str, Any]]) -> pd.DataFrame:
    return pd.DataFrame(flights)

def pd_dataframe_to_json(df: pd.DataFrame, filepath: str) -> None:
    df.to_json(filepath, orient='records', indent=2)
'''

# testing
'''data = load_json_response('new_example_response2.json')
flights = parse_flights(data)
df = flights_to_dataframe(flights)
pd_dataframe_to_json(df, 'flights.json')
print(df)#[['origin', 'destination', 'outbound_airline', 'price', 'provider']])
'''

@app.route('/api/get-flights')
def get_flights():
    data = load_json_response('new_example_response2.json')
    flights = parse_flights(data)
    return jsonify(flights)

if __name__ == '__main__':
    app.run(debug=True)