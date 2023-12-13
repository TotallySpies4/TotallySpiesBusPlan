import sys
import os
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime
import time
from mongomock import MongoClient  # Import MongoClient from mongomock
import pymongo.errors

module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../src/Data_Prep'))
sys.path.insert(0, module_path)

from gtfs_realtime_download import download_data_for_date

class TestDownloadDataForDate(unittest.TestCase):

    @patch('gtfs_realtime_download.MongoClient', MongoClient)
    @patch('gtfs_realtime_download.requests.get')
    @patch('gtfs_realtime_download.GridFS')
    def test_download_data_success(self, mock_requests_get, mock_gridfs, mock_mongo_client):
        # Arrange
        date = "2023-11-25"
        mock_response = MagicMock(status_code=200, content=b'mock_content')
        mock_requests_get.return_value = mock_response
        mock_fs_put = mock_gridfs.return_value.put

        # Retry logic
        retries = 3
        for attempt in range(1, retries + 1):
            try:
                # Act
                result = download_data_for_date(date)
                break  # Break if successful
            except pymongo.errors.ServerSelectionTimeoutError as e:
                if attempt == retries:
                    # If all retries failed, raise the exception
                    raise
                else:
                    # Retry after a delay
                    time.sleep(5)

        # Assert
        self.assertIsNotNone(result)
        mock_requests_get.assert_called_once_with(f"https://api.koda.trafiklab.se/KoDa/api/v2/gtfs-rt/sl/VehiclePositions?date={date}&key=gQpNjugJMEZZKu69pw3Sbz4PrLhZ0K_hVDGH5RAGUqk")
        mock_fs_put.assert_called_once_with(b'mock_content', filename=f"gtfs_{date}.bin")
        mock_mongo_client.assert_called_once_with('mongodb://localhost:27017/')

    @patch('gtfs_realtime_download.requests.get')
    def test_download_data_failure(self, mock_requests_get):
        # Arrange
        date = "2023-11-25"
        mock_response = MagicMock(status_code=404)
        mock_requests_get.return_value = mock_response

        # Act
        result = download_data_for_date(date)

        # Assert
        self.assertIsNone(result)
        mock_requests_get.assert_called_once_with(f"https://api.koda.trafiklab.se/KoDa/api/v2/gtfs-rt/sl/VehiclePositions?date={date}&key=gQpNjugJMEZZKu69pw3Sbz4PrLhZ0K_hVDGH5RAGUqk")

if __name__ == '__main__':
    unittest.main()