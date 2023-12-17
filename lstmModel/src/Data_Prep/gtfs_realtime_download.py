from datetime import datetime, timedelta
import requests
from pymongo import MongoClient
from gridfs import GridFS
import logging

# Logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def download_data_for_date(date):
    # MongoDB client setup
    client = MongoClient('mongodb:27017')
    db = client.TotallySpiesBusPlan
    fs = GridFS(db)  # GridFS instance
    api_url = f"https://api.koda.trafiklab.se/KoDa/api/v2/gtfs-rt/sl/VehiclePositions?date={date}&key=gQpNjugJMEZZKu69pw3Sbz4PrLhZ0K_hVDGH5RAGUqk"
    logging.info(f"Downloading data for the date {date}")
    response = requests.get(api_url)

    if response.status_code == 200:
        logging.info(f"Storing data for the date {date}")
        # Use GridFS to store the data
        file_id = fs.put(response.content, filename=f"gtfs_{date}.bin")
        logging.info(f"Successfully stored data for the date {date} with file_id {file_id}")
    else:
        logging.error(f"Error while downloading data for the date {date}. Status code: {response.status_code}")
        return None

#download_data_for_date("2023-12-10")
