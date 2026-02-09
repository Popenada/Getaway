from app import app
from flask import request, jsonify
import requests
from table_data import load_json_response, parse_flights
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/api/flight-search', methods=['POST'])
def flight_search():
    data = request.get_json()
    print("Received search request:", data)
    
    # test with static data for now
    data = load_json_response(BASE_DIR / 'new_example_response2.json')
    flights = parse_flights(data)
    return jsonify(flights)