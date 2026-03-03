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
    
    print('BODY:', body)

    #user input test
    inputs = {
        "searchid" : body.get("searchid", request.args.get("searchid", "TEST-ID")),
        
        "origins" : body.get("departureCodes", request.args.get("departureCodes")), # list of Origin Airport codes "ABC"
        "destinations" : body.get("arrivalCodes", request.args.get("arrivalCodes")), # list of Destination Airport codes "XYZ"
        
        "departureDate" : tuple(body.get("departureDate", request.args.get("departureDate"))), # tuple of Departure dates, formatted as YYYY-MM-DD
        "returnDate" : tuple(body.get("returnDate", request.args.get("returnDate"))), # tuple of Return dates, formatted as YYYY-MM-DD
        
        "adults" : int(body.get("travelers", request.args.get("travelers", 1))), # Number of adults, int
        
        "roundTrip" : body.get("roundTrip", request.args.get("roundTrip", "True")) in ("true", "True", "TRUE"), #bool, true = round trip
        "nonstop" : body.get("nonStop", request.args.get("nonStop", "False")) in ("true", "True", "TRUE"), #bool, whether or not there are connecting flights
        
        "included" : body.get("includedAirline", request.args.get("includedAirline")), #list of strings, list contains allowed airline codes
        "excluded" : body.get("excludedAirline", request.args.get("excludedAirline")), #list of strings, list contains excluded airline codes
        
        "maxPrice" : int(body.get("maxPrice", request.args.get("maxPrice", 999999))), #int, maximum allowed price
        
        "tripLength" : int(body.get("tripLength", request.args.get("tripLength", 0))), #int, max number of days between departure and arrival
        
        "departureWindow" : int(body.get("departureWindow", request.args.get("departureWindow", 0))), #int, range of dates near selected departure, max 3
        "returnWindow" : int(body.get("returnWindow", request.args.get("returnWindow", 0))) #int, range of dates near selected arrival, max 3
    }
    
    #minPrice = int(body.get("minPrice", 0))
    
    #print(inputs)
    print(inputs["origins"], inputs["destinations"], inputs["departureDate"], inputs["returnDate"])
    print(inputs["adults"], inputs["roundTrip"], inputs["nonstop"])
    try:
        print("----- API QUERIED -----")
        
        response = ticket_query(inputs)
    except:
        return "500"
    
    if not response:
        print("----- NO RESPONSE -----")
        return jsonify([])
    
    if response["meta"]["count"] == 0:
        print("----- NO FLIGHTS FOUND -----")
        return jsonify([])
    
    flights = parse_flights(inputs["searchid"], response)
    
    return jsonify(flights)
