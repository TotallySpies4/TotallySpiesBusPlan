import os
import logging
from datetime import datetime, timedelta

from gridfs import GridFS
from pymongo import MongoClient

from src.Data_Prep.gtfs_realtime_decompressor import decompress_7z_file
from src.Data_Prep.gtfs_realtime_reader import process_pb_directory
from src.Data_Prep.store_csv_to_db import store_csv_in_db

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def retrieve_and_decompress(date):
    client = MongoClient('mongodb:27017')
    db = client.TotallySpiesBusPlan
    fs = GridFS(db)

    logging.info(f"Start processing data for {date}")
    filename = f"gtfs_{date}.bin"
    try:
        # Retrieve the file from GridFS
        grid_out = fs.find_one({'filename': filename})
        if grid_out:
            zip_file_path = os.path.join('/tmp', filename)
            with open(zip_file_path, 'wb') as f:
                f.write(grid_out.read())

            logging.info(f"Start Decompressing {date}")
            # Decompress the file
            decompressed_file_path = decompress_7z_file(zip_file_path)
            logging.info(f"Finished Decompressing {date}")

            # Process the decompressed file
            logging.info(f"Start Processing decompressed file {date}")
            if decompressed_file_path:
                csv_file_path = f"/tmp/gtfs_{date}.csv"
                process_pb_directory(decompressed_file_path, csv_file_path)
                store_csv_in_db(csv_file_path)
                logging.info(f"Finished Processing decompressed file {date}")

                # Clean up: delete the decompressed file
                os.remove(decompressed_file_path)

            # Clean up: delete the zip file
            os.remove(zip_file_path)
            logging.info(f"Finished processing data for {date}. CVS file stored in database.")
        else:
            logging.error(f"No data found for {date}")
    except Exception as e:
        logging.error(f"Error processing data for {date}: {e}")

# retrieve_and_decompress('2023-12-10')
