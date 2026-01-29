import json
from amadeus import Client, Location, ResponseError

def query(origin, dest, dDate, numAdults):
    # origin & dest = "XYZ" airport codes.
    # Departure date formatted as "YYYY-MM-DD"
    # numAdults is int formatted as string "X"
    
    amadeus = Client(
        client_id='6s3NH6Rsqy4y8hjxuK5VPp3G9twyUTWt',
        client_secret='nKCQ8UrGPVORjjIa'
    )
    try:
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode = origin,
            destinationLocationCode=dest,
            departureDate = dDate,
            adults = numAdults
        )
        with open("new_example_response.json", "w") as file:
            file.write(json.dumps(response.result, indent=4))
    except ResponseError as error:
        print(error)
        
query("LAX", "DAL", "2026-02-13", "1")