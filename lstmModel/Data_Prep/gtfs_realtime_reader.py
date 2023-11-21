import os
import logging
import csv
from google.protobuf import text_format
from google.transit import gtfs_realtime_pb2
from pyasn1.compat.octets import null


# Function to initiate the processing of .pb files
def process_pb_directory(pb_directory, csv_file_path):
    # Open the CSV file in write mode
    with open(csv_file_path, "w", newline="") as csv_file:
        # Create a CSV writer
        csv_writer = csv.writer(csv_file)
        # Write the header row to the CSV file
        csv_writer.writerow(["Timestamp", "Trip ID", "Segment", "Latitude", "Longitude", "Bearing", "Speed"])

        # Iterate through each .pb file in the directory
        for root, dirs, files in os.walk(pb_directory):
            for file in files:
                if file.endswith(".pb"):
                    pb_file_path = os.path.join(root, file)
                    logging.info(f"Processing file: {pb_file_path}")
                    process_pb_file(pb_file_path, csv_writer)

    logging.info("CSV file generation complete.")


# Function to process a .pb file and write the data to a CSV file
def process_pb_file(pb_file_path, csv_writer):

    try:
        # Read the content of the .pb file
        with open(pb_file_path, "rb") as f:
            # Create a new FeedMessage instance
            feed_message = gtfs_realtime_pb2.FeedMessage()
            # Parse the content of the .pb file into the FeedMessage instance
            feed_message.ParseFromString(f.read())

        # Extract and write vehicle position data to the CSV file
        for entity in feed_message.entity:
            if entity.HasField("vehicle") and entity.vehicle.HasField("position"):
                # Extract the position and other relevant data
                position = entity.vehicle.position
            csv_writer.writerow([
                entity.vehicle.timestamp,
                entity.vehicle.trip.tripId,  # Assuming trip ID is accessed this way
                None,  # Default value for 'Segment', adjust as per your application logic
                position.latitude,
                position.longitude,
                position.bearing,
                position.speed
            ])

        logging.info(f"Processed {len(feed_message.entity)} entities from {pb_file_path}")

    except Exception as e:
        logging.error(f"Error processing the .pb file: {e}")
