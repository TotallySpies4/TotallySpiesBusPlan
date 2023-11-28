from datetime import datetime, timedelta
import requests
from pymongo import MongoClient
from gridfs import GridFS
import logging

# Logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# MongoDB client setup
client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan
fs = GridFS(db)  # GridFS instance


def download_data_for_date(date):
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

    # Download data for a range of dates

    #if __name__ == "__main__":
        # Download data for a range of dates
        # start_date = datetime(2023, 1, 4)
        # for i in range(7):
        # date = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
#download_data_for_date("2023-11-26")
