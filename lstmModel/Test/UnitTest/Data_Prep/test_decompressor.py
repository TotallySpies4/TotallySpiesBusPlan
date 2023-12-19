import unittest
import os
import py7zr

from src.Data_Prep.gtfs_realtime_decompressor import decompress_7z_file


class TestDecompress7zFile(unittest.TestCase):

    def setUp(self):
        current_file_dir = os.path.dirname(__file__)

        # Set up a valid 7z file for testing
        self.valid_7z_file = os.path.join(current_file_dir, 'testStub', 'sample-1.7z')
        # Create a valid 7z file or copy it to the test directory

        # Set up a bad 7z file for testing
        self.bad_7z_file = os.path.join(current_file_dir, 'testStub', 'sample-1-bad.7z')
        # Create a bad 7z file or copy it to the test directory

        # Non-existent file
        self.nonexistent_file = 'file.7z'

    def test_decompress_valid_file(self):
        # Test decompression with a valid file
        result = decompress_7z_file(self.valid_7z_file)
        self.assertIsNotNone(result)
        # Check if files are extracted
        self.assertTrue(os.path.exists(result))

    def test_decompress_bad_file(self):
        # Test decompression with a bad file
        result = decompress_7z_file(self.bad_7z_file)
        self.assertIsNone(result)



    def tearDown(self):
        # Clean up (remove extracted files, etc.) after tests
        pass
