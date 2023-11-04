import requests
from google.transit import gtfs_realtime_pb2
import csv
import time
from datetime import datetime, timedelta

def get_current_date():
    return datetime.now().date()

def get_filename_for_date(date):
    return f"gtfs_data_{date}.csv"

def collect_and_store_data():
    while True:
        current_date = get_current_date()
        filename = get_filename_for_date(current_date)

        url = "http://gtfs.ovapi.nl/nl/vehiclePositions.pb"

        try:
            response = requests.get(url)
            response.raise_for_status()  # Check for HTTP request errors

            feed = gtfs_realtime_pb2.FeedMessage()
            feed.ParseFromString(response.content)

            for entity in feed.entity:
                if entity.HasField("vehicle"):
                    vehicle = entity.vehicle
                    trip = vehicle.trip
                    position = vehicle.position

                    timestamp = int(vehicle.timestamp)
                    trip_id = trip.trip_id
                    route_id = trip.route_id
                    direction_id = trip.direction_id
                    start_time = trip.start_time
                    start_date = trip.start_date
                    vehicle_label = vehicle.vehicle.label
                    latitude = position.latitude
                    longitude = position.longitude
                    current_stop_sequence = vehicle.current_stop_sequence
                    current_status = vehicle.current_status

                    # Append data to the CSV file for the current date
                    with open(filename, "a", newline="") as csvfile:
                        fieldnames = {"Timestamp", "Trip ID", "Route ID", "Direction ID", "Start Time", "Start Date",
                                      "Vehicle Label", "Latitude", "Longitude", "Current Stop Sequence",
                                      "Current Status"}
                        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

                        print(f"Timestamp: {timestamp}, Trip ID: {trip_id}, Route ID: {route_id}, Direction ID: {direction_id}, Start Time: {start_time}, Start Date: {start_date}, Vehicle Label: {vehicle_label}, Latitude: {latitude}, Longitude: {longitude}, Current Stop Sequence: {current_stop_sequence}, Current Status: {current_status}")

                        # Write header if the file is empty
                        if csvfile.tell() == 0:
                            writer.writeheader()

                        writer.writerow({"Timestamp": timestamp, "Trip ID": trip_id, "Route ID": route_id, "Direction ID": direction_id, "Start Time": start_time, "Start Date": start_date, "Vehicle Label": vehicle_label, "Latitude": latitude, "Longitude": longitude, "Current Stop Sequence": current_stop_sequence, "Current Status": current_status})

        except requests.exceptions.RequestException as e:
            print(f"HTTP request error: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

        # Sleep for 1 hour between data collections
        time.sleep(3600)

if __name__ == "__main__":
    collect_and_store_data()
