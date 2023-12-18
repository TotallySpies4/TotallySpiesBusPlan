import unittest
import pandas as pd
import numpy as np

from src.Data_Prep.createSequence import createSequence


class TestCreateSequenceFunction(unittest.TestCase):

    def setUp(self):
        # Creating a sample DataFrame
        data = {
            'Trip ID_first': [1, 1, 1, 2, 2, 2],
            'Timestamp': pd.date_range(start='1/1/2023', periods=6, freq='T'),
            'Segment_first': [1, 2, 3, 1, 2, 3],
            'Speed_mean': [10, 20, 30, 40, 50, 60],
            # Add other necessary features
        }
        self.df = pd.DataFrame(data)
        self.features_to_scale = ['Speed_mean']  # Add other necessary features

    def test_normal_case(self):
        N = 2
        X, y_30, y_60, trip_ids, segments = createSequence(N, self.features_to_scale, self.df)
        self.assertEqual(len(X), 2)
        self.assertTrue(all(len(x) == N for x in X))


    def test_edge_cases(self):
        # Columns required by the createSequence function
        required_columns = ['Trip ID_first', 'Timestamp', 'Segment_first', 'Speed_mean'] + self.features_to_scale

        # Test with empty DataFrame but with required columns
        empty_df = pd.DataFrame(columns=required_columns)
        N = 2
        X, y_30, y_60, trip_ids, segments = createSequence(N, self.features_to_scale, empty_df)
        self.assertEqual(len(X), 0)

        # Test with DataFrame having fewer rows than N but with required columns
        small_df_data = {
            'Trip ID_first': [1],
            'Timestamp': [pd.Timestamp('2023-01-01')],
             'Segment_first': [1],
             'Speed_mean': [10],
            # Initialize other required features with dummy values if necessary
         }
        small_df = pd.DataFrame(small_df_data, columns=required_columns)
        X, y_30, y_60, trip_ids, segments = createSequence(N, self.features_to_scale, small_df)
        self.assertEqual(len(X), 0)

    def test_output_types(self):
        N = 2
        X, y_30, y_60, trip_ids, segments = createSequence(N, self.features_to_scale, self.df)

        # Check types of the outputs
        self.assertIsInstance(X, list)
        self.assertIsInstance(y_30, list)
        self.assertIsInstance(y_60, list)
        self.assertIsInstance(trip_ids, list)
        self.assertIsInstance(segments, list)

        # Add more checks for the contents of the lists

    # Add more test cases as needed
