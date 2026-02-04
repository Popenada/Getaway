import json
from amadeus import Client, Location, ResponseError

def query(searchid, origin, destination, dDate, rDate, numAdults):
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
            destinationLocationCode=destination,
            departureDate = dDate,
            adults = numAdults,
            returnDate = rDate
        )
        '''
        parameters = {
            "currencyCode": "USD",
            "originDestinations": [ {
                "id": "1", "originLocationCode": origin,
                "destinationLocationCode": destination, "departureDateTimeRange": {
                    "date": dDate, "time": "00:00:00"  
            } }, {
                "id": "2",
                "originLocationCode": destination,
                "destinationLocationCode": origin,  
                "departureDateTimeRange": { 
                    "date": rDate, 
                    "time": "00:00:00" 
                    } } ],
            "travelers": [ { 
                "id":  "1", 
                "travelerType": "ADULT" 
            }, { 
                "id": "2",
                "travelerType": "ADULT" \
            }, { 
                "id": "3",
                "travelerType": "HELD_INFANT", 
                "associatedAdultId": "1" 
                } ], 
            "sources": [ "GDS" ],
            "searchCriteria": {  
            "excludeAllotments": False,
            "addOneWayOffers": True,
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
                "returnToDepartureAirport": True,
                "railSegmentAllowed": True,
                "busSegmentAllowed": True,
                "carrierRestrictions": { 
                    "blacklistedInEUAllowed": True,
                    "includedCarrierCodes": [ "FA" ]
                    }, 
                "cabinRestrictions": [ 
                    { 
                        "cabin": "ECONOMY",
                        "coverage": "MOST_SEGMENTS",
                        "originDestinationIds": [ "2" ] 
                    }, { 
                        "cabin": "ECONOMY",
                        "coverage": "MOST_SEGMENTS",
                        "originDestinationIds": [ "1" ] 
                    } ],
                "connectionRestriction": { 
                    "airportChangeAllowed": True,
                    "technicalStopsAllowed": True 
            } } } }

    
        response = amadeus.shopping.flight_offers_search.post(json.dumps(parameters))
        
        with open("post_response.json", "w") as file:
            file.write(json.dumps(response.result, indent=4))
        '''
        
        f = "%s.json" %searchid
        with open(f, "w") as file:
            file.write(json.dumps(response.result, indent=4))
    except ResponseError as error:
        print(error)


#debug
query("TEST-SEARCH", "LAX", "DAL", "2026-02-13", "2026-02-20", "1")