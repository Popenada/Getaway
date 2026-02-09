from app import app
from flask import request
from get_tickets import query
from flask import jsonify
from table_data import load_json_response
from table_data import parse_flights

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/api/flight-search', methods=["GET"])
def flightSearch():
    
    # api request function
    # pulls parameters from url and echoes them back
    # Example url: http://localhost:5000/api/flight-search?origin=PAR&destination=LON&departure=2026-02-13&return=2026-03-13
    # type 'flask run' into terminal and go to url to test
    
    #user input test
    inputs = {
        "searchid" : request.args.get("searchid", "TEST-ID"),
        "departureDate" : request.args.get("departure"), # Departure date formatted asw YYYY-MM-DD
        "destination" : request.args.get("destination"), # Destination Airport code XYZ
        "returnDate" : request.args.get("return"), # Return date formatted as YYYY-MM-DD
        "origin" : request.args.get("origin"), # Origin Airport code ABC
        "adults" : request.args.get("adults", 1), # Number of adults, int}
        "roundTrip" : request.args.get("roundTrip", True), #bool, true = round trip
        "range" : request.args.get("range", False), #bool, true = range of dates
        "connections" : request.args.get("connections"), #int, max number of connections
        "includedAirlines" : request.args.get("included"), #list of strings, list contains allowed airline codes
        "excludedAirlines" : request.args.get("excluded"), #list of strings, list contains excluded airline codes
        "maxPrice" : request.args.get("maxPrice"), #int, maximum allowed price
        "tripLength" : request.args.get("tripLength") #int, max number of days between departure and arrival
    }
    
    print(inputs["origin"], inputs["destination"], inputs["departureDate"], inputs["returnDate"])
    try:
        query(inputs)
    except:
        return "500"
    print("api queried")
    
    data = load_json_response("%s.json" % inputs["searchid"])
    flights = parse_flights(data)
    return jsonify(flights)