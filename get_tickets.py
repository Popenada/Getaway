import json
from amadeus import Client, Location, ResponseError
from datetime import datetime, date, timedelta
from generate_range import getRange
# One-Way doesn't work
def ticket_query(data):
  searchid = data.get("searchid")
  origins = data.get("origins")
  destinations = data.get("destinations")
  dDate = data.get("departureDate")
  rDate = data.get("returnDate")
  numAdults = data.get("adults")
  roundTrip = data.get("roundTrip")
  isRange = data.get("range")
  maxPrice = data.get("maxPrice")
  nonstop = data.get("nonstop")
  included = data.get("included")
  excluded = data.get("excluded")
  tripLength = data.get("tripLength")
  departureWindow = data.get("departureWindow", 0)
  returnWindow = data.get("returnWindow", 0)
    
    # origin & dest = "XYZ" airport codes.
    # Departure date formatted as "YYYY-MM-DD"
    # numAdults is int formatted as string "X"
    
  amadeus = Client(
    client_id='6s3NH6Rsqy4y8hjxuK5VPp3G9twyUTWt',
    client_secret='nKCQ8UrGPVORjjIa',
  )
    
  parameters = {
    "currencyCode": "USD",
    "originDestinations": [ {
      "id": 1, 
      "originLocationCode": origins[0],
      "destinationLocationCode": destinations[0], 
      "alternativeOriginsCodes": origins[1:],
      "alternativeDesinationsCodes": destinations[1:],
      "departureDateTimeRange": {
        "date": dDate,
      } }],
      "travelers": [], 
      "sources": ["GDS"],
      "searchCriteria": {  
        "excludeAllotments": True,
        "maxFlightOffers": 1,
        "allowAlternativeFareOptions": True,
        "oneFlightOfferPerDay": False, 
        "additionalInformation": { 
          "chargeableCheckedBags": False, 
          "brandedFares": True, 
          "fareRules": False 
        },
        "pricingOptions": { 
          "includedCheckedBagsOnly": True 
        }, 
        "flightFilters": { 
          "crossBorderAllowed": True,
          "moreOvernightsAllowed": True,
          "returnToDepartureAirport": roundTrip,
          "railSegmentAllowed": True,
          "busSegmentAllowed": True,
          "cabinRestrictions": [ { 
            "cabin": "ECONOMY",
            "coverage": "MOST_SEGMENTS",
            "originDestinationIds": [1] 
          }, ],
          "connectionRestriction": { 
            "airportChangeAllowed": True,
            "technicalStopsAllowed": True
  } } } }
    
    #set maximum allowed price
  if maxPrice:
    parameters["searchCriteria"]["maxPrice"] = maxPrice
    
    #allow nonstop flights
  if nonstop:
    parameters["searchCriteria"]["flightFilters"]["connectionRestriction"]["maximumNumberOfConnections"] = 0
    
    #exclude selected airlines
  if excluded:
    parameters["searchCriteria"]["flightFilters"]["airlineRestrictions"]["excludedAirlineCodes"] = excluded
    
  if included:
    parameters["searchCriteria"]["flightFilters"]["airlineRestrictions"]["includedAirlineCodes"] = included
    
    #add return leg to round trips
  if roundTrip:
    returnTrip = {
      "id": 2,
      "originLocationCode": destinations[0],
      "destinationLocationCode": origins[0],
      "alternativeOriginsCodes": destinations[1:],
      "alternativeDestinationsCodes": origins[1:],
      "departureDateTimeRange": { 
        "date": rDate, 
    } }
    returnCabin = { 
      "cabin": "ECONOMY",
      "coverage": "MOST_SEGMENTS",
      "originDestinationIds": [2] 
    }
        
    parameters["originDestinations"].append(returnTrip)
    parameters["searchCriteria"]["flightFilters"]["cabinRestrictions"].append(returnCabin)
    
    #for modify parameters for range of dates
    if departureWindow:
      parameters["originDestinations"][0]["departureDateTimeRange"]["dateWindow"] = "I%dD" % departureWindow
        
    if returnWindow:
      parameters["originDestinations"][1]["departureDateTimeRange"]["dateWindow"] = "I%dD" % returnWindow
        
    
    #add numAdults to request
    for i in range(numAdults):
      traveler = {
        "id": i + 1,
        "travelerType": "ADULT"
      }
      parameters["travelers"].append(traveler)
    
    #print(parameters)
    
    response = {
      "meta": {
        "errors": [],
        "count": 0
      },
      "data": []
    }
    
    departureRange = getRange(dDate)
    returnRange = getRange(rDate)
    
    if returnRange == []:
      returnRange = [None]
    
    for departure in departureRange:
      for _return in returnRange:
        
        #print(departure, _return)
        
        parameters["originDestinations"][0]["departureDateTimeRange"]["date"] = departure[0]
        
        if departure[1] > 0:
          parameters["originDestinations"][0]["departureDateTimeRange"]["dateWindow"] = "I%dD" % departure[1]
              
        if roundTrip:
          
          parameters["originDestinations"][1]["departureDateTimeRange"]["date"] = _return[0]
          if _return[1] > 0:
            parameters["originDestinations"][1]["departureDateTimeRange"]["dateWindow"] = "I%dD" % _return[1]
          
          
        try:
          query = amadeus.shopping.flight_offers_search.post(parameters)
          response["data"] = response["data"] + query.result["data"]
          response["meta"]["count"] = len(response["data"])
          #print(response)
          
        except ResponseError as error:
          response["meta"]["errors"].append(error.description())
        
        
    #print(response)
    f = "%s.json" %searchid
    with open(f, "w") as file:
      file.write(json.dumps(response, indent=2))
    
    return response


#debug
args = {
    "searchid" : "TEST-SEARCH",
    "origins": ["LAX"],
    "destinations": ["NYC"],
    "departureDate": ("2026-03-17",),
    "returnDate": ("2026-03-24",),
    "roundTrip": True,
    "nonstop" : True,
    "maxPrice" : 2000,
    "adults" : 1,
}

#ticket_query(args)
