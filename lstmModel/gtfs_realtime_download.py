import os
import requests
import py7zr
from google.transit import gtfs_realtime_pb2

# Define the API endpoint
api_url = "https://api.koda.trafiklab.se/KoDa/api/v2/gtfs-rt/sl/VehiclePositions?date=2021-01-01&key=gQpNjugJMEZZKu69pw3Sbz4PrLhZ0K_hVDGH5RAGUqk"

# Define the output directory for pb files
output_directory = "output_pb_files"
# Define the output 7z file path
seven_zip_file_path = "history.7z"

# Make a request to the API
response = requests.get(api_url, stream=True)

# Check if the request was successful
if response.status_code == 200:
    # Ensure the output directory exists
    os.makedirs(output_directory, exist_ok=True)

    # Get the total file size for progress tracking
    total_size = int(response.headers.get('content-length', 0))

    # Initialize the downloaded size
    downloaded_size = 0

    # Save the 7z file
    with open(seven_zip_file_path, "wb") as f:
        for data in response.iter_content(chunk_size=1024):
            f.write(data)
            downloaded_size += len(data)
            # Print download progress
            print(f"Downloading... {downloaded_size}/{total_size} bytes", end="\r")

    print("\n7z file saved successfully.")

    try:
        # Extract contents of the 7z file
        with py7zr.SevenZipFile(seven_zip_file_path, mode="r") as archive:
            archive.extractall(output_directory)
        print("7z file extracted successfully.")

    except py7zr.exceptions.Bad7zFile as e:
        print(f"Error extracting 7z file: {e}")
else:
    print(f"Failed to retrieve data from API. Status code: {response.status_code}")
