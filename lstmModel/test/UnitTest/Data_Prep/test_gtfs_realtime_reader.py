import unittest
from unittest.mock import patch, mock_open, MagicMock

from google.transit import gtfs_realtime_pb2

from src.Data_Prep.gtfs_realtime_reader import process_pb_directory


class TestProcessPB(unittest.TestCase):

    @patch('src.Data_Prep.gtfs_realtime_reader.os.walk')
    @patch('src.Data_Prep.gtfs_realtime_reader.open', new_callable=mock_open)
    @patch('src.Data_Prep.gtfs_realtime_reader.csv.writer')
    def test_process_pb_directory(self, mock_csv_writer, mock_open_file, mock_os_walk):
        # Setup mock for os.walk to return a list of .pb files
        mock_os_walk.return_value = [('/path/to/pb', [], ['file1.pb', 'file2.pb'])]

        # Mock a pb file content
        pb_content = b'your serialized pb content'
        mock_open_file.return_value.read.return_value = pb_content

        # Mock the FeedMessage object
        mock_feed_message = MagicMock(spec=gtfs_realtime_pb2.FeedMessage)

        # Setup the FeedMessage entities
        mock_feed_message.entity = [
            MagicMock(),  # You would set up this mock as needed
        ]

        # Mock the parsing of pb content
        with patch('src.Data_Prep.gtfs_realtime_reader.gtfs_realtime_pb2.FeedMessage', return_value=mock_feed_message):
            # Call the function to test
            process_pb_directory('/path/to/pb', 'output.csv')

            # Check that the CSV writer was created
            mock_csv_writer.assert_called_once()

            # Check that the pb files were read
            mock_open_file().read.assert_called()

            self.assertTrue(mock_csv_writer().writerow.called)

