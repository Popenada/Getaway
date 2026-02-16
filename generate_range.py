from datetime import datetime, date, timedelta

def getRange(startDate, endDate, startWindow, endWindow):
    formatString = "%Y-%m-%d"
    
    startDate = datetime.strptime(startDate, formatString).date() 
    endDate = datetime.strptime(endDate, formatString).date()
    
    if startDate < endDate:
        startDate -= timedelta(days=startWindow)
        endDate += timedelta(days=endWindow)
    else:
        startDate += timedelta(days=startWindow)
        endDate -= timedelta(days=endWindow)
        
    #sets direction of range
    operator = 0 #range of departure dates
    if startDate > endDate:
        operator = 1 #range of return dates
                
    return rangeHelper(operator, startDate, endDate)
    
def rangeHelper(operator, startDate, endDate):
    #lands exactly on endDate
    if startDate == endDate:
        #print(startDate, 0)
        return [(startDate, 0)]
    
    #goes past endDate
    
    elif operator == 0 and startDate > endDate:
        return []
    
    elif operator == 1 and startDate < endDate:
        return []
    
    #finds the difference between start and end, limits it to max 1 week, and calls at next non-included date
    elif operator == 0:
        delta = min(endDate - startDate, timedelta(days=3))
        #print(startDate + delta, delta.days)
        return [(str(startDate + delta), delta.days)] + rangeHelper(operator, startDate + (2 * delta) + timedelta(days=1), endDate)
    
    elif operator == 1:
        delta = min(startDate - endDate, timedelta(days=3))
        #print(startDate - delta, delta.days)
        return [(str(startDate - delta), delta.days)] + rangeHelper(operator, startDate - (2 * delta) - timedelta(days=1), endDate)
    

print(getRange("2024-02-01", "2024-01-01", 0, 0))