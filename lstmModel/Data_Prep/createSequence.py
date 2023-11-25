import pandas as pd
import logging

def createSequence(N, features_to_scale, resampled_df):
    # Initialize empty lists to hold sequences and targets
    X = []
    y_30, y_60 = [], []

    # Group by 'Trip ID' and sort by 'Segment'
    for trip_id, group in resampled_df.groupby('Trip ID_first'):
        group = group.sort_values(by=['Timestamp', 'Segment_first'])
        for i in range(N, len(group) - 60):  # Assuming at least an hour of data ahead
            # Create sequences from the scaled features
            seq = group.iloc[i - N:i][features_to_scale].values
            # Append the mean speed for 30 and 60 minutes ahead to the targets
            y_30.append(group.iloc[i + 30]['Speed_mean'])  # Speed mean in 30 minutes
            y_60.append(group.iloc[i + 60]['Speed_mean'])  # Speed mean in 60 minutes
            X.append(seq)
    return X, y_30, y_60

