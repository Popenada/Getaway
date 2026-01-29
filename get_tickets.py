import json
from amadeus import Client, Location, ResponseError

def query():
    amadeus = Client(
        client_id='6s3NH6Rsqy4y8hjxuK5VPp3G9twyUTWt',
        client_secret='nKCQ8UrGPVORjjIa'
    )
    try:
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode = 'LAX',
            destinationLocationCode='DAL',
            departureDate = '2026-02-02',
            adults='1'
        )
        with open("new_example_response.json", "w") as file:
            file.write(json.dumps(response.result, indent=4))
    except ResponseError as error:
        print(error)
        
query()