import os

from gridfs import GridFS
from pymongo import MongoClient


def store_csv_in_db(csv_file_path):
    client = MongoClient('mongodb:27017')
    db = client.TotallySpiesBusPlan
    fs = GridFS(db)

    # Open the CSV file in binary read mode
    with open(csv_file_path, 'rb') as csv_file:
        # Store the CSV file in GridFS
        fs.put(csv_file, filename=os.path.basename(csv_file_path))
    print(f"Stored CSV file in database: {csv_file_path}")
