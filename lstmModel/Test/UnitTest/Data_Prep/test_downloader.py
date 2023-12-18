import os
import unittest
from unittest.mock import patch, MagicMock
import sys
module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../src/Data_Prep'))
sys.path.insert(0, module_path)
from src.Data_Prep.gtfs_realtime_download import download_data_for_date


class TestDownloadDataForDate(unittest.TestCase):

    @patch('src.Data_Prep.gtfs_realtime_download.requests.get')
    @patch('src.Data_Prep.gtfs_realtime_download.MongoClient')
    def test_download_data_for_date_success(self, mock_mongo_client, mock_requests_get):
        # Mocking the response from requests.get
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.content = b'some_vehicle_position_data'
        mock_requests_get.return_value = mock_response

        # Mocking MongoClient to return a mock database instance
        mock_db = MagicMock()
        mock_mongo_client.return_value.__getitem__.return_value = mock_db

        # Mocking GridFS to use the mock database
        mock_gridfs = MagicMock()
        with patch('src.Data_Prep.gtfs_realtime_download.GridFS', return_value=mock_gridfs):
            # Call the function with a test date
            date = '2023-01-01'
            download_data_for_date(date)

            # Check if requests.get was called correctly
            mock_requests_get.assert_called_once_with(f"https://api.koda.trafiklab.se/KoDa/api/v2/gtfs-rt/sl/VehiclePositions?date={date}&key=gQpNjugJMEZZKu69pw3Sbz4PrLhZ0K_hVDGH5RAGUqk")

            # Check if GridFS put was called correctly
            mock_gridfs.put.assert_called_once_with(b'some_vehicle_position_data', filename=f"gtfs_{date}.bin")

    @patch('gtfs_realtime_download.MongoClient')  # Mock MongoDB client
    @patch('gtfs_realtime_download.requests.get')  # Mock requests.get
    def test_download_data_for_date_failure(self, mock_get, mock_mongo_client):
        # Mocking a failed response from requests.get
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        # Call the function with a test date
        date = '2023-01-01'
        result = download_data_for_date(date)

        # Check if the function returned None
        self.assertIsNone(result)
