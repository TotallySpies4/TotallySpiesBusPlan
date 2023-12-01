import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId as O

client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan
trips = db['trips']
routes = db['routes']
routeShort = []

df = pd.read_csv('predictedData.csv')
tripIds = df['Trip_ID'].unique()
for tripId in tripIds:
    trip = trips.find_one({'trip_id': str(int(tripId))})
    print(trip['route_id'])
    routeShort.append(trip['route_id'])

setRoute = set(routeShort)
print(tripIds)
print(setRoute)

for route in setRoute:
    route = routes.find_one({'_id': O(route)})
    print(route['route_short_name'])
