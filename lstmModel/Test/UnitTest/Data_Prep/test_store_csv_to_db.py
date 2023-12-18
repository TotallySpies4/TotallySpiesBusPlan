import unittest


import unittest
from unittest.mock import patch, MagicMock
import os

from src.Data_Prep.store_csv_to_db import store_csv_in_db


class TestStoreCsvInDb(unittest.TestCase):

    @patch('src.Data_Prep.store_csv_to_db.MongoClient')  # Mock the MongoClient
    @patch('src.Data_Prep.store_csv_to_db.GridFS')      # Mock GridFS
    @patch('src.Data_Prep.store_csv_to_db.open', new_callable=unittest.mock.mock_open, read_data='data')  # Mock file open
    def test_store_csv_in_db(self, mock_open, mock_gridfs, mock_mongo_client):
        # Prepare a mock file path
        test_file_path = 'test.csv'

        # Call the function
        store_csv_in_db(test_file_path)

        # Check if the file open was called correctly
        mock_open.assert_called_with(test_file_path, 'rb')

        # Get the mock GridFS instance
        mock_fs = mock_gridfs(mock_mongo_client.return_value.TotallySpiesBusPlan)

        # Check if the put method was called on GridFS instance
        mock_fs.put.assert_called()
        # You can add more specific assertions here to check the filename or content



