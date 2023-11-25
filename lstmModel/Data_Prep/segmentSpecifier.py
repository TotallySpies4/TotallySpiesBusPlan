import math
import pandas as pd
from pymongo import MongoClient

client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan
stoptimes = db['stoptimes']
trip = db['trips']

def calculate_current_segment(latitude, longitude, vehicle_bearing, trip_id):
    trip_object_id = db.trips.find_one({'trip_id': trip_id})['_id']
    stop_times_cursor = db.stoptimes.find({'trip_id': str(trip_object_id)}).sort('stop_sequence')
    stop_times_df = pd.DataFrame(list(stop_times_cursor))
    nearest_stop, nearest_stop_index = find_nearest_stop(stop_times_df, latitude, longitude)
    current_location = {'latitude': latitude, 'longitude': longitude}
    if nearest_stop is None:
        print("Keine Haltestelle gefunden.")
    for index in range(nearest_stop_index, len(stop_times_df) - 1):
        next_stop = stop_times_df.iloc[index + 1]
        #print(f'next stop {next_stop}')

        bearing_to_next_stop = calculate_bearing(current_location, next_stop)
        if is_moving_towards(vehicle_bearing, bearing_to_next_stop):
            return nearest_stop.stop_sequence
    return None


def find_nearest_stop(stop_times_df, latitude, longitude):
    nearest_stop_index = None
    nearest_stop = None
    min_distance = float('inf')

    for index, stop in stop_times_df.iterrows():
        distance = haversine_distance(latitude, longitude, stop['location']['latitude'], stop['location']['longitude'])
        if distance < min_distance:
            min_distance = distance
            nearest_stop = stop
            nearest_stop_index = index

    return nearest_stop, nearest_stop_index


def calculate_bearing(pointA, pointB):
    """Berechnet die Fahrtrichtung von Punkt A zu Punkt B."""
    lat1 = math.radians(pointA['latitude'])
    lat2 = math.radians(pointB['location']['latitude'])
    diff_long = math.radians(pointB['location']['longitude'] - pointA['longitude'])

    x = math.sin(diff_long) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - (math.sin(lat1) * math.cos(lat2) * math.cos(diff_long))

    initial_bearing = math.atan2(x, y)

    # Normalisieren auf 0° - 360°
    bearing = (math.degrees(initial_bearing) + 360) % 360
    return bearing


def is_moving_towards(current_bearing, target_bearing):
    """Überprüft, ob die aktuelle Fahrtrichtung der Zielrichtung entspricht."""
    bearing_difference = abs(target_bearing - current_bearing)
    return bearing_difference <= 45 or bearing_difference >= 315  # Toleranzbereich von 45°


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371e3  # Radius der Erde in Metern
    d1 = math.radians(lat1)
    d2 = math.radians(lat2)
    fd = math.radians(lat2 - lat1)
    fDelta = math.radians(lon2 - lon1)

    a = math.sin(fd / 2) * math.sin(fd / 2) + math.cos(d1) * math.cos(d2) * math.sin(fDelta / 2) * math.sin(fDelta / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c  # Distanz in Metern

segement = calculate_current_segment(59.3099250793457, 18.097824096679688, 13, "14010000648621468")
print(f'current segment {segement}')

