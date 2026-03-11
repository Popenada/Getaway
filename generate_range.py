from datetime import datetime, date, timedelta

#takes date pair and two ints and outputs a list of date int pairs
def getRange(date):
    
    if date == None:
        return [None]
    formatString = "%Y-%m-%d"
    
    
    startDate = datetime.strptime(date[0], formatString).date()
    
    if len(date) == 1:
        return [(str(startDate), 0)]
    
    endDate = datetime.strptime(date[1], formatString).date()

    dates = []
                
    while(True):
        if startDate <= endDate:
            delta = min((endDate - startDate) // 2, timedelta(days=3))
            dates.append((str(startDate + delta), delta.days))
            #print(dates)
            startDate += timedelta(days=2 * delta.days + 1)
            #print(startDate)
            
        else:
            return dates
        
    
#print(getRange(("2024-01-01", "2024-01-12")))