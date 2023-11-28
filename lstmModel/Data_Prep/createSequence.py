import pandas as pd
import logging


def createSequence(N, features_to_scale, resampled_df):
    X = []
    y_30, y_60 = [], []

    for trip_id, group in resampled_df.groupby('Trip ID_first'):
        group = group.sort_values(by=['Timestamp', 'Segment_first'])
        print(f"Trip ID: {trip_id}, Group size: {len(group)}")

        for i in range(N, len(group)):

            if i + 30 < len(group) and i + 60 < len(group):
                seq = group.iloc[i - N:i][features_to_scale].values
                if len(seq) == N:
                    y_30.append(group.iloc[i + 30]['Speed_mean'])
                    y_60.append(group.iloc[i + 60]['Speed_mean'])
                    X.append(seq)

    return X, y_30, y_60
