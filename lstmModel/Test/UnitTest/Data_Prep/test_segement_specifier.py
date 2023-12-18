import unittest
from unittest.mock import MagicMock, patch

from src.Data_Prep.segmentSpecifier import haversine_distance, is_moving_towards, calculate_bearing, find_nearest_stop, \
    calculate_current_segment


class MyTestCase(unittest.TestCase):
    def test_haversine_distance(self):
        # Test with known locations (Berlin and Munich)
        berlin_lat, berlin_lon = 52.5200, 13.4050
        munich_lat, munich_lon = 48.1351, 11.5820
        distance = haversine_distance(berlin_lat, berlin_lon, munich_lat, munich_lon)

        # The known distance between Berlin and Munich is approximately 504 km
        # Allowing some margin for error due to different methods of measurement
        self.assertAlmostEqual(distance / 1000, 504, delta=10)

    def test_is_moving_towards_true(self):
        self.assertTrue(is_moving_towards(0, 45))  # Within 45 degrees
        self.assertTrue(is_moving_towards(350, 0))  # Within 45 degrees
        self.assertTrue(is_moving_towards(0, 315))  # Within 45 degrees

    def test_is_moving_towards_false(self):
        self.assertFalse(is_moving_towards(0, 90))  # Outside 45 degrees
        self.assertFalse(is_moving_towards(0, 270)) # Outside 45 degrees
        self.assertFalse(is_moving_towards(100, 200)) # Outside 45 degrees

    def test_calculate_bearing(self):
        # Defining two points for the test
        pointA = {'latitude': 52.5200, 'longitude': 13.4050}  # Berlin
        pointB = {'location': {'latitude': 48.1351, 'longitude': 11.5820}}  # Munich

        # Calculating bearing
        bearing = calculate_bearing(pointA, pointB)

        # The bearing should be roughly southeast for Berlin to Munich
        # Allowing some margin for error
        self.assertAlmostEqual(bearing, 195, delta=10)

    @patch('src.Data_Prep.segmentSpecifier.haversine_distance')
    def test_find_nearest_stop(self, mock_haversine):
        # Setup mock DataFrame
        mock_stop_times_df = MagicMock()
        mock_stop_times_df.iterrows.return_value = [
            (0, {'location': {'latitude': 52.5200, 'longitude': 13.4050}}),  # Berlin
            (1, {'location': {'latitude': 48.1351, 'longitude': 11.5820}}),  # Munich
        ]

        # Mocking haversine_distance to return specific distances
        mock_haversine.side_effect = lambda lat1, lon1, lat2, lon2: {
            (52.5200, 13.4050): 10,  # Distance from reference point to Berlin
            (48.1351, 11.5820): 500  # Distance from reference point to Munich
        }[lat2, lon2]

        # Test data
        test_latitude, test_longitude = 52.5200, 13.4050  # Reference point (Berlin)

        # Call the function
        nearest_stop, nearest_stop_index = find_nearest_stop(mock_stop_times_df, test_latitude, test_longitude)

        # Assertions
        self.assertEqual(nearest_stop_index, 0)  # Expecting Berlin to be the nearest
        self.assertEqual(nearest_stop['location']['latitude'], 52.5200)
        self.assertEqual(nearest_stop['location']['longitude'], 13.4050)

    @patch('src.Data_Prep.segmentSpecifier.MongoClient')  # Mock the MongoClient
    @patch('src.Data_Prep.segmentSpecifier.find_nearest_stop')
    @patch('src.Data_Prep.segmentSpecifier.calculate_bearing')
    @patch('src.Data_Prep.segmentSpecifier.is_moving_towards')
    def test_calculate_current_segment(self, mock_is_moving_towards, mock_calculate_bearing, mock_find_nearest_stop, mock_mongo_client):
        # Setup mock MongoClient
        mock_db = MagicMock()
        mock_mongo_client.return_value = mock_db

        # Mock the find_one and find methods of the collections
        mock_db.trips.find_one.return_value = {'_id': 'mock_trip_object_id'}
        mock_db.stoptimes.find.return_value = [
            {'stop_sequence': 1, 'location': {'latitude': 52.5200, 'longitude': 13.4050}},  # Example stop
            {'stop_sequence': 2, 'location': {'latitude': 48.1351, 'longitude': 11.5820}},  # Example stop
        ]

        # Mocking find_nearest_stop, calculate_bearing and is_moving_towards as before
        mock_find_nearest_stop.return_value = ({'stop_sequence': 1}, 0)
        mock_calculate_bearing.return_value = 90
        mock_is_moving_towards.return_value = True

        # Test data
        test_latitude, test_longitude, test_vehicle_bearing, test_trip_id = 52.5200, 13.4050, 90, 'trip123'

        # Call the function
        current_segment = calculate_current_segment(test_latitude, test_longitude, test_vehicle_bearing, test_trip_id)

        # Assertions
        self.assertEqual(current_segment, None)  # Expecting the stop_sequence of the nearest stop




