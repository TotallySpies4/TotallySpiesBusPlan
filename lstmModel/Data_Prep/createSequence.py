import pandas as pd
import logging



def createSequence(N, features_to_scale, resampled_df):
    X, y_30, y_60, trip_ids, segments = [], [], [], [], []

    for trip_id, group in resampled_df.groupby('Trip ID_first'):
        group = group.sort_values(by=['Timestamp', 'Segment_first'])

        for i in range(N, len(group)):
            seq = group.iloc[i - N:i][features_to_scale].values
            if len(seq) == N:
                X.append(seq)
                if i + 30 < len(group):
                    y_30.append(group.iloc[i + 30]['Speed_mean'])
                else:
                    y_30.append(None)  # Or some placeholder if needed
                if i + 60 < len(group):
                    y_60.append(group.iloc[i + 60]['Speed_mean'])
                else:
                    y_60.append(None)
                trip_ids.append(trip_id)
                segments.append(group.iloc[i]['Segment_first'])

    return X, y_30, y_60, trip_ids, segments
