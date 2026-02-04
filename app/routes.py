from app import app
from flask import request

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
    
    searchid = request.args.get("searchid") # unique identifier for search session
    departureDate = request.args.get("departure") # Departure date formatted asw YYYY-MM-DD
    destination = request.args.get("destination") # Destination Airport code XYZ
    returnDate = request.args.get("return") # Return date formatted as YYY-MM-DD
    origin = request.args.get("origin") # Origin Airport cose ABC
    adults = request.args.get("adults") # Number of adults, int
    
    return {
        "searchid" : searchid,
        "origin": origin,
        "destination": destination,
        "departure": departureDate,
        "return": returnDate,
        "numAdults": adults}
