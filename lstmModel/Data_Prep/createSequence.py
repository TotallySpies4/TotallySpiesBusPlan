import pandas as pd
import logging



def createSequence(N, features_to_scale, resampled_df):
    X, y_30, y_60, trip_ids, segments = [], [], [], [], []

    for trip_id, group in resampled_df.groupby('Trip ID_first'):
        group = group.sort_values(by=['Timestamp', 'Segment_first'])

        for i in range(N, len(group) - 60):
            seq = group.iloc[i - N:i][features_to_scale].values
            if len(seq) == N:
                X.append(seq)
                y_30.append(group.iloc[i + 30]['Speed_mean'])
                y_60.append(group.iloc[i + 60]['Speed_mean'])
                trip_ids.append(trip_id)
                segments.append(group.iloc[i]['Segment_first'])

    return X, y_30, y_60, trip_ids, segments
