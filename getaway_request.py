from amadeus import Client, Location, ResponseError
from datetime import datetime, timedelta
from random import sample, choice
from get_tickets import ticket_query
import json


#takes two ints and outputs a list of recommended flight object
def getaway(amadeus, lat, long):
    
    '''
    Fetching nearest airport
    '''
    airport = None
    
    try:
        response = amadeus.reference_data.locations.airports.get(latitude = lat, longitude = long)
        airport = response.data[0]["iataCode"] # get first closest airport object and extract 3 letter code
        print(airport) #see result for nearest airport
    
    except ResponseError as error:
        return "getAirport", error
    
    '''
    Get semirandom destination codes
    '''
    
    #destination.json contains a list of curated destinations. The list is not final and should be added upon
    with open("destinations.json", "r") as file:
        destinations_list = json.load(file)
        destinations = sample(destinations_list, k=4)
        
        #If the origin location is selected from the list, remove it
        if airport in destinations:
            destinations.remove(airport)
        else:
            destinations.pop()
    
    '''
    For each destination, find cheapest dates from origin
    '''
    
    results = []
    for destination in destinations:
        print(destination)
        #Choose a random date of departure within 2 weeks to 1 month
        departure = datetime.today().date() + timedelta(days=choice(range(10,25)))
        
        #set a return date 1 to 3 weeks after departure
        returnDate = departure + timedelta(days=choice(range(8,20)))
        
        print(departure, returnDate)
        
        try:
            params = {
                "searchid" : "Getaway"+airport,
                "origins": [airport],
                "destinations": [destination],
                "departureDate": (str(departure),),
                "returnDate": (str(returnDate),),
                "roundTrip": True,
                "adults" : 1,
                "departureWindow": 3,
                "returnWindow": 3,
                "maxResults": 50
                }
            response = ticket_query(amadeus, params)
            results.append(response)
            
        except ResponseError as error:
            return "getFlights", error
    
    #return results
    return results
'''
amadeus = Client(
    client_id='6s3NH6Rsqy4y8hjxuK5VPp3G9twyUTWt',
    client_secret='nKCQ8UrGPVORjjIa'
)

print(getaway(amadeus, 34.0549, -118.2426)) #coordinates for LA
'''
