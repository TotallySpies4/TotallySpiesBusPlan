import unittest
from unittest.mock import patch, MagicMock
import os
import sys
import tempfile
import shutil
import logging
import py7zr

module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../src/Data_Prep'))
sys.path.insert(0, module_path)

from gtfs_realtime_decompressor import decompress_7z_file

class TestDecompress7zFile(unittest.TestCase):

    def setUp(self):
        # Create a temporary directory for each test
        self.temp_dir = tempfile.mkdtemp(prefix='test_decompress_7z_file_')

    def tearDown(self):
        # Remove the temporary directory and its contents
        shutil.rmtree(self.temp_dir)

    @patch('gtfs_realtime_decompressor.py7zr.SevenZipFile')
    def test_decompress_7z_file_success(self, mock_sevenzipfile):
        # Arrange
        zip_file_path = 'sample-1.7z'
        temp_directory = self.temp_dir

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
            mock_archive.extractall.assert_called_once_with(path=temp_directory)

    @patch('gtfs_realtime_decompressor.py7zr.SevenZipFile')
    def test_decompress_7z_file_failure(self, mock_sevenzipfile):
        # Arrange
        zip_file_path = 'sample-1.7z'
        mock_archive = mock_sevenzipfile.return_value
        mock_archive.extractall.side_effect = py7zr.exceptions.Bad7zFile("Bad 7z file")

        # Act and Assert
        with self.assertRaises(py7zr.exceptions.Bad7zFile):
            decompress_7z_file(zip_file_path)

        mock_sevenzipfile.assert_called_once_with(zip_file_path, mode='r')
        logging.error.assert_called_once_with("Fehler beim Extrahieren der 7z-Datei: Bad 7z file")

    def _create_test_files(self, path):
        # Create some test files in the specified directory
        with open(os.path.join(path, 'file1.txt'), 'w') as file1:
            file1.write("Test content for file1.txt")
        with open(os.path.join(path, 'file2.txt'), 'w') as file2:
            file2.write("Test content for file2.txt")

if __name__ == '__main__':
    unittest.main()
