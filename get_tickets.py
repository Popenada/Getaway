import json
from amadeus import Client, Location, ResponseError
from datetime import datetime, date, timedelta
from generate_range import getRange
from requests import HTTPError
from duffel_client import create_offer_request
def ticket_query(data):
  searchid = data.get("searchid")
  origins = data.get("origins")
  destinations = data.get("destinations")
  dDate = data.get("departureDate")
  rDate = data.get("returnDate")
  numAdults = data.get("adults")
  roundTrip = data.get("roundTrip")
  maxPrice = data.get("maxPrice")
  nonstop = data.get("nonstop")
  included = data.get("included")
  excluded = data.get("excluded")

  passengers = [{"type": "adult"} for _ in range(numAdults)]

    # origin & dest = "XYZ" airport codes.
    # Departure date formatted as "YYYY-MM-DD"
    # numAdults is int formatted as string "X"
    
  slices = [{
    "origin": origins[0],
    "destination": destinations[0],
    "departure_date": dDate[0]
  }]
  
  if roundTrip:
    slices.append({
      "origin": destinations[0],
      "destination": origins[0],
      "departure_date": rDate[0]
    })

  response = {"meta": {"errors": [], "count": 0}, "data": []}
 

  try:
    result = create_offer_request(
      slices=slices,
      passengers=passengers, 
      max_connections=0 if nonstop else None,
    )
    offers = result.get("offers", [])

    if included:
        offers = [o for o in offers if o["owner"]["iata_code"] in included]
    if excluded:
        offers = [o for o in offers if o["owner"]["iata_code"] not in excluded]
    if maxPrice:
        offers = [o for o in offers if float(o["total_amount"]) <= maxPrice]
    response["data"] = offers
    response["meta"]["count"] = len(offers)
  except HTTPError as error:
    response["meta"]["errors"].append(str(error))
    #print(response)
  f = "%s.json" %searchid
  with open(f, "w") as file:
    file.write(json.dumps(response, indent=2))
    
  return response


#debug
'''
amadeus = Client(
        client_id='6s3NH6Rsqy4y8hjxuK5VPp3G9twyUTWt',
        client_secret='nKCQ8UrGPVORjjIa'
    )

args = {
    "searchid" : "TEST-SEARCH",
    "origins": ["LAX"],
    "destinations": ["JFK"],
    "departureDate": ("2026-03-17",),
    "roundTrip": False,
    "nonstop" : True,
    "maxPrice" : 2000,
    "adults" : 1,
    "excluded": ["AA"]
}

print(ticket_query(amadeus, args))
'''
