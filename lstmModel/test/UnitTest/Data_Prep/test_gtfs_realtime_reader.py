import unittest
import os
import sys
import tempfile
import csv
from datetime import datetime
from google.protobuf import text_format
from google.transit import gtfs_realtime_pb2
from unittest.mock import mock_open, patch

module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../src/Data_Prep'))
sys.path.insert(0, module_path)

from gtfs_realtime_reader import process_pb_directory, process_pb_file

class TestProcessPBFile(unittest.TestCase):

    def setUp(self):
        # Create a temporary directory to store test files
        self.temp_dir = tempfile.mkdtemp()

    def tearDown(self):
        # Remove the temporary directory and its contents
        os.rmdir(self.temp_dir)

    def test_process_pb_file(self):
        # Create a sample protobuf file for testing
        pb_content = """
    header {
        gtfs_realtime_version: "1.0"
    }
    entity {
        id: "some_id"
        vehicle {
            timestamp: 1636354655
            trip {
                trip_id: "123"
            }
            position {
                latitude: 37.7749
                longitude: -122.4194
                bearing: 90.0
                speed: 25.0
            }
        }
    }
"""


        pb_file_path = os.path.join(self.temp_dir, "test.pb")

        # Write the sample protobuf content to the test file
        with open(pb_file_path, "wb") as pb_file:
            pb_file.write(text_format.Merge(pb_content, gtfs_realtime_pb2.FeedMessage()).SerializeToString())

        # Create the directory if it doesn't exist
        os.makedirs(self.temp_dir, exist_ok=True)

        # Create a CSV file for writing
        csv_file_path = os.path.join(self.temp_dir, "test.csv")

        # Mock the CSV writer to capture the written rows
        with patch("builtins.open", mock_open()) as m:
            process_pb_file(pb_file_path, csv.writer(m.return_value))

        # Read the CSV file and check the content
        with open(csv_file_path, "r", newline="") as csv_file:
            csv_reader = csv.reader(csv_file)
            header = next(csv_reader)
            row = next(csv_reader)

        # Check if the header and row match the expected values
        self.assertEqual(header, ["Timestamp", "Trip ID", "Segment", "Latitude", "Longitude", "Bearing", "Speed"])
        self.assertEqual(row, ["1636354655", "123", None, "37.7749", "-122.4194", "90.0", "25.0"])

if __name__ == '__main__':
    unittest.main()
