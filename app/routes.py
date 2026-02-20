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


@app.route('/api/flight-search', methods=["POST"])
def flightSearch():
    
    # api request function
    # pulls parameters from url and echoes them back
    # Example url: http://localhost:5000/api/flight-search?origin=PAR&destination=LON&departure=2026-02-13&return=2026-03-13
    # type 'flask run' into terminal and go to url to test
    
    # read JSON body for POST requests first, fall back to query params
    body = request.get_json(silent=True) or {}

    #user input test
    inputs = {
        "searchid" : body.get("searchid", request.args.get("TEST-ID")),
        "departureDate" : tuple(body.get("departureDate", request.args.get("departureDate"))), # tuple of Departure dates, formatted asw YYYY-MM-DD
        "destinations" : body.get("arrivalLocation", request.args.get("arrivalLocation")), # list of Destination Airport codes "XYZ"
        "returnDate" : tuple(body.get("returnDate", request.args.get("returnDate"))), # tuple of Return dates, formatted as YYYY-MM-DD
        "origins" : body.get("departureLocation", request.args.get("departureLocation")), # list of Origin Airport codes "ABC"
        "adults" : int(body.get("travelers", request.args.get("travelers", 1))), # Number of adults, int}
        "roundTrip" : body.get("roundTrip", request.args.get("roundTrip", "True")) in ("true", "True", "TRUE"), #bool, true = round trip
        "nonstop" : body.get("nonStop", request.args.get("nonStop")) in ("true", "True", "TRUE"), #bool, whether or not there are connecting flights
        "included" : body.get("includedAirline", request.args.get("includedAirline")), #list of strings, list contains allowed airline codes
        "excluded" : body.get(request.args.get("excludedAirline")), #list of strings, list contains excluded airline codes
        "maxPrice" : int(body.get("excludedAirline", request.args.get("maxPrice", 0))), #int, maximum allowed price
        "tripLength" : int(body.get(request.args.get("tripLength",0))), #int, max number of days between departure and arrival
        "departureWindow" : int(body.get("tripLength", request.args.get("departureWindow",0))), #int, range of dates near selected departure, max 3
        "returnWindow" : int(body.get("returnWindow", request.args.get("returnWindow",0))) #int, range of dates near selected arrival, max 3
    }
    
    minPrice = int(body.get("minPrice", 0))
    
    print(inputs)
    try:
        ticket_query(inputs)
    except:
        return "500"
    print("api queried")
    
    data = load_json_response("%s.json" % inputs["searchid"])
    flights = parse_flights(data)
    return jsonify(flights)