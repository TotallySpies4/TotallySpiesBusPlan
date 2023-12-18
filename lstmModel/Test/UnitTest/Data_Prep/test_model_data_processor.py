import unittest
from unittest.mock import patch, MagicMock
import pandas as pd

from src.Data_Prep.modelDataProcessor import process_resample_data_from_file

class TestProcessResampleDataFromFile(unittest.TestCase):

    @patch('src.Data_Prep.modelDataProcessor.MongoClient')  # Mock MongoClient
    @patch('src.Data_Prep.modelDataProcessor.GridFS')      # Mock GridFS
    @patch('src.Data_Prep.modelDataProcessor.pd.read_csv') # Mock pandas read_csv
    @patch('src.Data_Prep.modelDataProcessor.calculate_current_segment') # Mock calculate_current_segment
    def test_process_resample_data_from_file(self, mock_calculate_current_segment, mock_read_csv, mock_gridfs, mock_mongo_client):
        # Setup mock for MongoClient and GridFS
        mock_db = MagicMock()
        mock_mongo_client.return_value = mock_db
        mock_fs = mock_gridfs(mock_db)
        mock_fs.find_one.return_value = MagicMock()  # Mock returned file

        # Setup mock for pandas read_csv
        mock_chunk = pd.DataFrame({
            'Trip ID': [1, 2],
            'Latitude': [52.5200, 48.1351],
            'Longitude': [13.4050, 11.5820],
            'Bearing': [180, 190],
            'Timestamp': [1609459200, 1609459260],
            'Speed': [30, 40]  # Include 'Speed' column
        })
        mock_read_csv.return_value = [mock_chunk]

        # Mock calculate_current_segment to return a fixed value
        mock_calculate_current_segment.return_value = 1

        # Test data
        test_date = '2023-01-01'
        test_chunk_size = 10000

        # Call the function
        resampled_df = process_resample_data_from_file(test_date, test_chunk_size)

        # Assertions
        self.assertIsInstance(resampled_df, pd.DataFrame)
        # Additional assertions as necessary

if __name__ == '__main__':
    unittest.main()
