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
        client_secret='nKCQ8UrGPVORjjIa'
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
            "maxFlightOffers": 2,
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
        parameters["searchCriteria"]["flightFilters"]["cabinCriteria"].append(returnCabin)
    
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
    
    print(parameters)
    
    response = {
      "meta": {
        "count": 0
      },
      "data": []
    }
    
    if isRange == "departure":
      for date, window in getRange(dDate, rDate, departureWindow, returnWindow):
        print(date, window)
        parameters["originDestinations"][0]["departureDateTimeRange"]["date"] = date
        if window > 0:
          parameters["originDestinations"][0]["departureDateTimeRange"]["dateWindow"] = "I%dD" % window
        
        try:
          query = amadeus.shopping.flight_offers_search.post(parameters)
          response["data"] = response["data"] + query.result["data"]
          response["meta"]["count"] = len(response["data"])
          print(response)
          
        except ResponseError as error:
          print(error.description())
        
    elif isRange == "return":
      for date in getRange(rDate, dDate, returnWindow, departureWindow):
        parameters["originDestinations"][1]["departureDateTimeRange"]["date"] = date
        if window > 0:
          parameters["originDestinations"][1]["departureDateTimeRange"]["dateWindow"] = "I%dD" % window
          
        try:
          query = amadeus.shopping.flight_offers_search.post(parameters)
          response["data"] += query.result
          response["meta"]["count"] = len(response["data"])
        except ResponseError as error:
          print(error.description())
          
    else:
    
    
      try:
          '''
          response = amadeus.shopping.flight_offers_search.get(
              originLocationCode = origin,
              destinationLocationCode=destination,
              departureDate = dDate,
              adults = numAdults,
              returnDate = rDate
          )
          '''
      
          query = amadeus.shopping.flight_offers_search.post(parameters)
          
          response = query.result
          
          '''
          with open("post_response.json", "w") as file:
              file.write(json.dumps(response.result, indent=4))
          '''
      except ResponseError as error:
        print(error.description())
        return (origins, destinations, dDate, rDate)
      
    print(response)
    f = "%s.json" %searchid
    with open(f, "w") as file:
      file.write(json.dumps(response, indent=2))


#debug
args = {
    "searchid" : "TEST-SEARCH",
    "origins": ["PAR", "IST"],
    "destinations": ["LON"],
    "departureDate": "2026-03-20",
    "returnDate": "2026-03-28",
    "roundTrip": False,
    "range" : "departure",
    "nonstop" : True,
    "maxPrice" : 1000,
    "adults" : 1,
}

ticket_query(args)