import os
import json
import requests
import py7zr
from google.transit import gtfs_realtime_pb2
from pyspark.sql import SparkSession
from pyspark.sql.functions import explode


# Define the API endpoint
api_url = "https://api.koda.trafiklab.se/KoDa/api/v2/gtfs-rt/klt/VehiclePositions?date=2021-01-01&key=gQpNjugJMEZZKu69pw3Sbz4PrLhZ0K_hVDGH5RAGUqk"

# Define the output directory for pb files
output_directory = "output_pb_files"

# Make a request to the API
response = requests.get(api_url)

# Check if the request was successful
if response.status_code == 200:
    # Ensure the output directory exists
    os.makedirs(output_directory, exist_ok=True)

    # Save the 7z file
    with open("history.7z", "wb") as f:
        f.write(response.content)
        print("7z file saved successfully.")

    try:
        # Extract contents of the 7z file
        with py7zr.SevenZipFile("history.7z", mode="r") as archive:
            archive.extractall(output_directory)
        print("7z file extracted successfully.")

        # Initialize Spark session
        spark = SparkSession.builder \
            .appName("GTFSRealtimeAnalysis") \
            .config("spark.jars", "./jars/spark-protobuf_2.11-1.0.0.jar") \
            .getOrCreate()

        # Read pb files into a DataFrame using spark-protobuf library
        df = spark.read.format("protobuf").option("inputFormat", "protobuf").load(output_directory)

        # Assuming the vehicle position data is nested in a column named 'positions'
        exploded_df = df.select("other_columns", explode("positions").alias("position"))

        # Write the original DataFrame to a CSV file
        exploded_df.write.csv("consolidated_data.csv", header=True)

        # Stop the Spark session
        spark.stop()

    except py7zr.exceptions.Bad7zFile as e:
        print(f"Error extracting 7z file: {e}")
else:
    print(f"Failed to retrieve data from API. Status code: {response.status_code}")
