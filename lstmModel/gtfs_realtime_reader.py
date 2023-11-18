import os
import csv
from google.protobuf import text_format
from google.transit import gtfs_realtime_pb2

# Specify the directory where your .pb files are located
pb_directory = "output_pb_files"
csv_file_path = "vehicle_positions.csv"

# Open the CSV file in write mode
with open(csv_file_path, "w", newline="") as csv_file:
    # Create a CSV writer
    csv_writer = csv.writer(csv_file)

    # Write the header row to the CSV file
    csv_writer.writerow(["Entity ID", "Timestamp", "Latitude", "Longitude", "Bearing", "Speed", "Vehicle ID"])

    # Iterate through each file in the specified directory and its subdirectories
    for root, dirs, files in os.walk(pb_directory):
        for file in files:
            if file.endswith(".pb"):
                # Form the path to the .pb file
                pb_file_path = os.path.join(root, file)

                print(f"Processing file: {pb_file_path}")

                # Read the content of the .pb file
                with open(pb_file_path, "rb") as f:
                    # Create a new FeedMessage instance
                    feed_message = gtfs_realtime_pb2.FeedMessage()

                    # Parse the content of the .pb file into the FeedMessage instance
                    feed_message.ParseFromString(f.read())

                    # Extract and write vehicle position data to the CSV file
                    for entity in feed_message.entity:
                        if entity.HasField("vehicle") and entity.vehicle.HasField("position"):
                            position = entity.vehicle.position
                            csv_writer.writerow([
                                entity.id,
                                entity.vehicle.timestamp,
                                position.latitude,
                                position.longitude,
                                position.bearing,
                                position.speed,
                                entity.vehicle.vehicle.id
                            ])

                print(f"Processed {len(feed_message.entity)} entities from {pb_file_path}")
                print()

print("CSV file generation complete.")
