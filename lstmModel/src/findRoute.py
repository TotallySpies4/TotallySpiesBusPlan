import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId as O

# Verbindung zum MongoDB-Client herstellen
client = MongoClient('mongodb:27017')

# Datenbank und Collections wählen
db = client.TotallySpiesBusPlan
trips = db['trips']
routes = db['routes']

# Liste für Route IDs
route_ids = []

# CSV-Datei einlesen
df = pd.read_csv('predictedData.csv')

# Eindeutige Trip-IDs extrahieren
trip_ids = df['Trip_ID'].unique()
print(len(trip_ids))

# Trip-Informationen für jede Trip-ID sammeln
for trip_id in trip_ids:
    trip = trips.find_one({'trip_id': str(int(trip_id))})
    if trip and 'route_id' in trip:
        route_ids.append(trip['route_id'])

# Eindeutige Set von Route-IDs erstellen
unique_route_ids = set(route_ids)

# Anzahl der Trips für jede Route berechnen
trip_count_by_route = {route_id: route_ids.count(route_id) for route_id in unique_route_ids}

# Informationen für jede Route ausgeben
for route_id in unique_route_ids:
    route = routes.find_one({'_id': O(route_id)})
    if route and 'route_short_name' in route:
        print(f"Route: {route['route_short_name']}, Anzahl der Trips: {trip_count_by_route[route_id]}")
