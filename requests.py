import requests
import pandas as pd

#Search request handler
#Access api and return result

url = "url"
data = ""

def query():
    response = requests.post(url, data=data)

    return response