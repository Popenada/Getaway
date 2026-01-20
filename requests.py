import requests
import pandas as pd

#Search request handler
#Access api and return result
#https://rapidapi.com/apiheya/api/tripadvisor16
#returns all tickets within criteria as well as all vendors. Only add best vendor link to table

url = "url"
data = ""

def query():
    response = requests.post(url, data=data)

    return response