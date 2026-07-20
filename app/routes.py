from app import app
from flask import request
from get_tickets import ticket_query
from flask import jsonify
from table_data import parse_flights
from datetime import datetime, timedelta
from random import randrange
from autocomplete import get_locations
from getaway_request import getaway
from json import dumps


@app.route("/")
@app.route("/index")
def index():
    return "Hello, World!"


@app.route("/api/flight-search", methods=["POST"])
def flightSearch():

    # api request function
    # Example url: http://localhost:5000/api/flight-search?origin=PAR&destination=LON&departure=2026-02-13&return=2026-03-13
    # type 'flask run' into terminal and go to url to test

    # read JSON body for POST requests first, fall back to query params
    body = request.get_json(silent=True) or {}
    
    default = defaultDates()
    
    print('BODY:', body)


    # user input test
    inputs = {
        "searchid": body.get("searchid", "TEST-ID"),
        "origins": body.get("departureCodes"),  # list of Origin Airport codes "ABC"
        "destinations": body.get("arrivalCodes"),  # list of Destination Airport codes "XYZ"
        "departureDate": tuple(body.get("departureDate")),  # tuple of Departure dates, formatted as YYYY-MM-DD
        "returnDate": tuple(body.get("returnDate")),  # tuple of Return dates, formatted as YYYY-MM-DD
        "adults": int(body.get("travelers", 1)),  # Number of adults, int
        "roundTrip": str(body.get("roundTrip", "true")).lower() in ("true", "1"),  # bool, true = round trip
        "nonstop": str(body.get("nonstopOnly", "false")).lower() in ("true", "1"),  # bool, whether or not there are connecting flights
        "included": body.get("includedAirline"),  # list of strings, list contains allowed airline codes
        "excluded": body.get("excludedAirline"),  # list of strings, list contains excluded airline codes
        "maxPrice": int(body.get("maxPrice")),  # int, maximum allowed price
        "tripLength": int(body.get("tripLength", 0)),  # int, max number of days between departure and arrival NOT IMPLEMENTED
        "departureWindow": int(body.get("departureWindow", 0)),  # int, range of dates near selected departure, max 3
        "returnWindow": int(body.get("returnWindow", 0)),  # int, range of dates near selected arrival, max 3
    }

    
    if len(inputs["departureDate"]) == 0:
        default = defaultDates(departureDate=None)
        inputs["departureDate"] = default[0],
        inputs["returnDate"] = default[1],
    # minPrice = int(body.get("minPrice", 0))
    # print(inputs)
    print(
        inputs["origins"],
        inputs["destinations"],
        inputs["departureDate"],
        inputs["returnDate"],
    )
    print(inputs["adults"], inputs["roundTrip"], inputs["nonstop"])
    try:
        print("----- API QUERIED -----")

        response = ticket_query(inputs)
    except:
        return "500"

    if not response:
        print("----- NO RESPONSE -----")
        return jsonify({"error": "API returned no response"})

    if response["meta"]["count"] == 0:
        print("----- NO FLIGHTS FOUND -----")
        return jsonify({"error": "No flights found matching criteria"})

    flights = parse_flights(inputs['searchid'], inputs['adults'], response)

    return jsonify(flights)


@app.route('/api/locations', methods=["GET"])
def autocompleteLocations():
    query = request.args.get("query", "")
    
    return get_locations(query)

@app.route("/api/getaway", methods=["POST"])
def getawaySearch():
    # function for getaway requests
    # required input structure: searchID string, float longitude, float latitude
    # Find Nearest Airport (departure)->Get destinations->Make query->Format results
    # ->sort formatted results by price, return Results
    body = request.get_json(silent=True) or {}

    print("BODY:", body)

    searchId = body.get("searchId")
    longitude = float(body.get("longitude"))
    latitude = float(body.get("latitude"))
    rate_limit = int(body.get("rateLimit", -1))

    if not isinstance(longitude, float):
        print("Error: Bad longitude input")
        return jsonify("Error: Bad Longitude Input")
    
    if not isinstance(latitude, float):
        print("Error: Bad latitude Input")
        return jsonify("Error: Bad latitude input")
    
    getaways = getaway(latitude, longitude)
    
    if not isinstance(getaways, list):
        print("Error: bad structure")
        return jsonify("Error: bad structure -", getaways)
        
    if len(getaways) == 0:
        print("Error: No results returned")
        return jsonify("Error: No results returned")
    
    for i in range(len(getaways)):
        getaways[i] = sorted(parse_flights(searchId, 1, getaways[i]), key=lambda x: x["price"])
        
        #limit number of objects in each list
        if rate_limit >= 0:
            limit = len(getaways[i]) - rate_limit
            #get list without the last limit elements
            getaways[i] = getaways[i][:-limit]
        
    
    with open("GETAWAY-TEST.json", "w") as file:
        file.write(dumps(getaways, indent=2))
      
    return jsonify(getaways)

#generate default dates
def defaultDates(departureDate=None):
    dateFormat = "%Y-%m-%d"
    departure = departureDate
    
    if departure is None:
        today = datetime.today().date()
        departure = today + timedelta(days=randrange(4,7))
    else:
        departure = datetime.strptime(departure, dateFormat)
    returnDate = departure + timedelta(days=randrange(3,10))
    
    #return tuple of dates, 0 is departure 1 is return
    return (str(departure), str(returnDate))
