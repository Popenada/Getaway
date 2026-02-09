from app import app
from flask import request
from get_tickets import query
from json import jsonify
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
    # Example url: http://localhost:5000/api/flight-search?searchid=test&departure=LAX
    # type 'flask run' into terminal and go to url to test
    
    #user input test
    inputs = {
        "searchid" : request.args.get("searchid"),
        "departureDate" : request.args.get("departure"), # Departure date formatted asw YYYY-MM-DD
        "destination" : request.args.get("destination"), # Destination Airport code XYZ
        "returnDate" : request.args.get("return"), # Return date formatted as YYYY-MM-DD
        "origin" : request.args.get("origin"), # Origin Airport code ABC
        "adults" : request.args.get("adults") # Number of adults, int}
    }
    
    try:
        query(inputs)
    except:
        return 500
    
    data = load_json_response("%s.json" % inputs["searchid"])
    flights = parse_flights(data)
    return jsonify(flights)