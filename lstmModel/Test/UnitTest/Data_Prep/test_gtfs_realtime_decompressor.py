import unittest
from unittest.mock import patch
import os
import sys
import tempfile
import shutil
import logging

logging.basicConfig(level=logging.ERROR)
from py7zr import SevenZipFile, Bad7zFile

# Add the path to the module under test
module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../src/Data_Prep'))
sys.path.insert(0, module_path)

from gtfs_realtime_decompressor import decompress_7z_file


class TestDecompress7zFile(unittest.TestCase):

    def setUp(self):
        # Create a temporary directory for each test
        self.temp_dir = tempfile.mkdtemp(prefix='test_decompress_7z_file_')

    def tearDown(self):
        # Remove the temporary directory and its contents
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    @patch('gtfs_realtime_decompressor.py7zr.SevenZipFile')
    @patch('logging.error')
    def test_decompress_7z_file_success(self, mock_error, mock_sevenzipfile):
        # Arrange
        zip_file_path = 'sample-1.7z'

        # Create a temporary file for the extracted content
        with tempfile.TemporaryDirectory() as temp_dir:
            mock_archive = mock_sevenzipfile.return_value
            mock_archive.getnames.return_value = ['file1.txt', 'file2.txt']
            expected_extracted_file = os.path.join(temp_dir, 'file1.txt')

            def extractall_side_effect(path):
                self._create_test_files(path)
                return None

            mock_archive.extractall.side_effect = extractall_side_effect

            # Act
            result = decompress_7z_file(zip_file_path)

            # Assert
            self.assertEqual(result, expected_extracted_file)
            mock_sevenzipfile.assert_called_once_with(zip_file_path, mode='r')
            mock_archive.extractall.assert_called_once_with(path=temp_dir)

    @patch('gtfs_realtime_decompressor.py7zr.SevenZipFile', side_effect=Bad7zFile("Bad 7z file"))
    @patch('logging.error')
    def test_decompress_7z_file_failure(self, mock_error, mock_sevenzipfile):
        # Arrange
        zip_file_path = 'sample-1.7z'

        # Act
        with self.assertLogs(level=logging.ERROR) as logs:
            result = decompress_7z_file(zip_file_path)

        # Assert
        mock_sevenzipfile.assert_called_once_with(zip_file_path, mode='r')
        mock_error.assert_called_once_with("Error extracting 7z file: Bad 7z file")
        self.assertEqual(logs.records[0].levelno, logging.ERROR)  # Check if an ERROR log was triggered
        self.assertEqual(logs.records[0].getMessage(), "Error extracting 7z file: Bad 7z file")
        self.assertIsNone(result)

    def _create_test_files(self, path):
        # Create some test files in the specified directory
        with open(os.path.join(path, 'file1.txt'), 'w') as file1:
            file1.write("Test content for file1.txt")
        with open(os.path.join(path, 'file2.txt'), 'w') as file2:
            file2.write("Test content for file2.txt")


if __name__ == '__main__':
    # Specify the output path for the 7z file
    output_path = 'sample-1.7z'

    # Specify the files you want to include in the 7z file
    files_to_compress = ['file1.txt', 'file2.txt']

    # Create the sample 7z file
    with SevenZipFile(output_path, 'w') as archive:
        for file_path in files_to_compress:
            archive.write(file_path, os.path.basename(file_path))

    print(f"Sample 7z file '{output_path}' created successfully.")

    # Run the tests
    unittest.main()