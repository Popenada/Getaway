import json
from amadeus import Client, Location, ResponseError
import time

# One-Way doesn't work
def query(data):
    searchid = data.get("searchid", "TEST-ID")
    origin = data.get("origin")
    destination = data.get("destination")
    dDate = data.get("departureDate")
    rDate = data.get("returnDate", None)
    numAdults = data.get("adults", 1)
    roundTrip = data.get("roundTrip", True)
    isRange = data.get("range", False)
    
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
            "originLocationCode": origin,
            "destinationLocationCode": destination, 
            "departureDateTimeRange": {
                "date": dDate,
        } }],
        "travelers": [], 
        "sources": ["GDS"],
        "searchCriteria": {  
            "excludeAllotments": True,
            "addOneWayOffers": not roundTrip,
            "maxFlightOffers": 10,
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
                }, { 
                    "cabin": "ECONOMY",
                    "coverage": "MOST_SEGMENTS",
                    "originDestinationIds": [2] 
                }],
                "connectionRestriction": { 
                    "airportChangeAllowed": True,
                    "technicalStopsAllowed": True,
                    "maximumNumberOfConnections": 2
            } } } }
    
    #add return leg to round trips
    if roundTrip:
        returnTrip = {
            "id": 2,
            "originLocationCode": destination,
            "destinationLocationCode": origin,  
            "departureDateTimeRange": { 
                "date": rDate, 
        } }
        parameters["originDestinations"].append(returnTrip)
    
    #for modify parameters for range of dates
    if isRange:
        date_format = "%Y-%m-%d"
        t1 = time.mktime(time.strptime(dDate, date_format))
        t2 = time.mktime(time.strptime(rDate, date_format))
        days = int((t2 - t1) / 86400)
        legs = parameters["originDestinations"]
        legs[0]["departureDateTimeRange"]["dateWindow"] = "P%dD" %days
        legs[1]["departureDateTimeRange"]["dateWindow"] = "M%dD" %days
    
    #add numAdults to request
    for i in range(numAdults):
        traveler = {
            "id": i+1,
            "travelerType": "ADULT"
        }
        parameters["travelers"].append(traveler)
    
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
    
        response = amadeus.shopping.flight_offers_search.post(parameters)
        
        with open("post_response.json", "w") as file:
            file.write(json.dumps(response.result, indent=4))
        
        f = "%s.json" %searchid
        with open(f, "w") as file:
            file.write(json.dumps(response.result, indent=4))
    except ResponseError as error:
        print(error)


#debug
args = {
    "origin": "PAR",
    "destination": "LON",
    "departureDate": "2026-02-12",
    "returnDate": "2026-03-12",
    "roundTrip": True,
    "range" : False
}

query(args)