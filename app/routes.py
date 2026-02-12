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
        "searchid": body.get("searchid", request.args.get("searchid", "TEST-ID")),
        "departureDate": body.get("departure", request.args.get("departure")),
        "destination": body.get("destination", request.args.get("destination")),
        "returnDate": body.get("return", request.args.get("return")),
        "origin": body.get("origin", request.args.get("origin")),
        "adults": int(body.get("adults", request.args.get("adults", 1))),
        "roundTrip": body.get("roundTrip", request.args.get("roundTrip", True)),
        "range": body.get("range", request.args.get("range", False)),
        "connections": body.get("connections", request.args.get("connections")),
        "includedAirlines": body.get("included", request.args.get("included")),
        "excludedAirlines": body.get("excluded", request.args.get("excluded")),
        "maxPrice": body.get("maxPrice", request.args.get("maxPrice")),
        "tripLength": body.get("tripLength", request.args.get("tripLength"))
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
