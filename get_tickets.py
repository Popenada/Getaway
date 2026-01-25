import requests
import pandas as pd
import json
from datetime import datetime
from typing import List, Dict, Any

# Search request handler
# Access api and return result
# https://rapidapi.com/apiheya/api/tripadvisor16
# returns all tickets within criteria as well as all vendors. Only add best vendor link to table

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)

url = "url"
data = ""

def load_json_response(filepath: str) -> Dict[str, Any]:
    with open(filepath, 'r') as f:
        return json.load(f)

def parse_flights(response_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    flights = []
    
    if 'data' not in response_data or 'flights' not in response_data['data']:
        return flights
    
    for flight in response_data['data']['flights']:
        # extract outbound segment (first leg)
        outbound_seg = flight['segments'][0]
        outbound_leg = outbound_seg['legs'][0]
        
        # extract return segment (second leg) if it exists
        return_leg = None
        if len(flight['segments']) > 1:
            return_seg = flight['segments'][1]
            return_leg = return_seg['legs'][0]
        
        # get best purchase link
        best_price = None
        provider = None
        if flight.get('purchaseLinks'):
            best_link = flight['purchaseLinks'][0]
            best_price = best_link.get('totalPrice')
            if best_link.get('partnerSuppliedProvider'):
                provider = best_link['partnerSuppliedProvider'].get('displayName')
        
        flight_obj = {
            'outbound_airline': outbound_leg['marketingCarrier']['displayName'],
            'outbound_flight_number': outbound_leg['flightNumber'],
            'outbound_departure': outbound_leg['departureDateTime'],
            'outbound_arrival': outbound_leg['arrivalDateTime'],
            'outbound_stops': outbound_leg['numStops'],
            'outbound_duration_km': outbound_leg['distanceInKM'],
            'return_airline': return_leg['marketingCarrier']['displayName'] if return_leg else None,
            'return_flight_number': return_leg['flightNumber'] if return_leg else None,
            'return_departure': return_leg['departureDateTime'] if return_leg else None,
            'return_arrival': return_leg['arrivalDateTime'] if return_leg else None,
            'return_stops': return_leg['numStops'] if return_leg else None,
            'price': best_price,
            'currency': flight['purchaseLinks'][0]['currency'] if flight.get('purchaseLinks') else 'Unknown',
            'provider': provider,
            'class': outbound_leg['classOfService'],
            'origin': outbound_leg['originStationCode'],
            'destination': outbound_leg['destinationStationCode']
        }
        flights.append(flight_obj)
    
    return flights

def flights_to_dataframe(flights: List[Dict[str, Any]]) -> pd.DataFrame:
    return pd.DataFrame(flights)

def query():
    response = None
    return response

# testing
data = load_json_response('example_response.json')
flights = parse_flights(data)
df = flights_to_dataframe(flights)
print(df)#[['origin', 'destination', 'outbound_airline', 'price', 'provider']])