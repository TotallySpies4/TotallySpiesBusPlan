import unittest
from unittest.mock import patch, MagicMock
import os

from src.Data_Prep.retrieve_and_decompress import retrieve_and_decompress


class TestRetrieveAndDecompress(unittest.TestCase):

    @patch('src.Data_Prep.retrieve_and_decompress.MongoClient')
    @patch('src.Data_Prep.retrieve_and_decompress.GridFS')
    @patch('src.Data_Prep.retrieve_and_decompress.os.path.join')
    @patch('src.Data_Prep.retrieve_and_decompress.open', new_callable=unittest.mock.mock_open)
    @patch('src.Data_Prep.retrieve_and_decompress.decompress_7z_file')
    @patch('src.Data_Prep.retrieve_and_decompress.process_pb_directory')
    @patch('src.Data_Prep.retrieve_and_decompress.store_csv_in_db')
    @patch('src.Data_Prep.retrieve_and_decompress.os.remove')
    def test_retrieve_and_decompress(self, mock_os_remove, mock_store_csv_in_db, mock_process_pb_directory,
                                     mock_decompress_7z_file, mock_file_open, mock_os_path_join, mock_gridfs,
                                     mock_mongo_client):
        # Mock date and file paths
        test_date = '2023-01-01'
        test_zip_file_path = f'/tmp/gtfs_{test_date}.bin'
        test_decompressed_file_path = f'/tmp/gtfs_{test_date}_decompressed'
        test_csv_file_path = f"/tmp/gtfs_{test_date}.csv"

        # Setup mocks
        mock_os_path_join.return_value = test_zip_file_path
        mock_decompress_7z_file.return_value = test_decompressed_file_path
        mock_grid_out = MagicMock()
        mock_gridfs.return_value.find_one.return_value = mock_grid_out
        mock_grid_out.read.return_value = b'dummy binary data'

        # Call the function
        retrieve_and_decompress(test_date)

        # Assertions
        mock_file_open.assert_called_with(test_zip_file_path, 'wb')
        mock_decompress_7z_file.assert_called_with(test_zip_file_path)
        mock_process_pb_directory.assert_called_with(test_decompressed_file_path, test_csv_file_path)
        mock_store_csv_in_db.assert_called_with(test_csv_file_path)
        mock_os_remove.assert_called_with(test_zip_file_path)
        mock_os_remove.assert_called_with(test_zip_file_path)


if __name__ == '__main__':
    unittest.main()
