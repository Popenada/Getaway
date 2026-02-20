from app import app
from flask import request
from get_tickets import ticket_query
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
    '''
     inputs = {
        "searchid" : string, unique descriptor
        "departureDate" : string, "YYYY-MM-DD"
        "returnDate" : string, "YYYY-MM-DD"
        "origins" : [string], location/airport codes
        "destinations" : [string], location/airport codes
        "adults" : int
        "roundTrip" : bool
        "range" : string, "departure" or "return"
        "nonstop" : bool
        "included" : [string], airline codes
        "excluded" : [string], airline codes
        "maxPrice" : int
        "tripLength" : int, not yet implemented
        "departureWindow" : int, 0-3
        "returnWindow" : int, 0-3
    }
    
    '''
    
    
    #user input test
    inputs = {
        "searchid" : request.args.get("searchid", "TEST-ID"),
        "departureDate" : request.args.get("departureDate"), # Departure date formatted asw YYYY-MM-DD
        "destinations" : request.args.get("arrivalLocation"), # list of Destination Airport codes "XYZ"
        "returnDate" : request.args.get("returnDate"), # Return date formatted as YYYY-MM-DD
        "origins" : request.args.get("departureLocation"), # list of Origin Airport codes "ABC"
        "adults" : int(request.args.get("travelers", 1)), # Number of adults, int}
        "roundTrip" : request.args.get("roundTrip", "True") in ("true", "True", "TRUE"), #bool, true = round trip
        "nonstop" : request.args.get("nonStop") in ("true", "True", "TRUE"), #bool, whether or not there are connecting flights
        "included" : request.args.get("includedAirline"), #list of strings, list contains allowed airline codes
        "excluded" : request.args.get("excludedAirline"), #list of strings, list contains excluded airline codes
        "maxPrice" : int(request.args.get("maxPrice", 0)), #int, maximum allowed price
        "tripLength" : int(request.args.get("tripLength",0)), #int, max number of days between departure and arrival
        "departureWindow" : int(request.args.get("departureWindow",0)), #int, range of dates near selected departure, max 3
        "returnWindow" : int(request.args.get("returnWindow",0)) #int, range of dates near selected arrival, max 3
    }
    
    minPrice = int(request.args.get("minPrice", 0))
    
    print(inputs)
    try:
        ticket_query(inputs)
    except:
        return "500"
    print("api queried")
    
    data = load_json_response("%s.json" % inputs["searchid"])
    flights = parse_flights(data)
    return jsonify(flights)

