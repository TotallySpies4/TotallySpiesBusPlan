import pandas as pd
import logging


# Load the data from the file system
resampled_df = pd.read_csv('resampled_df.csv')
print (resampled_df.head(5))

# Assuming N is defined
N = 5  # Number of past segments to consider for the prediction

X, y = [], []
# Group by 'Trip ID'
for trip_id, group in resampled_df.groupby('Trip ID_first'):
    # Make sure group is sorted by 'Segment'
    group = group.sort_values(by=['Timestamp', 'Segment_first'])
    print(f'group {group}')
    # Now create sequences for LSTM
    for i in range(N, len(group) - N):
        # Create sequences using the mean values of the features
        logging.info(f'group {group}')
        print('hello')
        seq = group.iloc[i - N:i][['Latitude_mean', 'Longitude_mean', 'Bearing_mean', 'Speed_mean']].values
        # Predict the speed of the next segment using the max value
        target = group.iloc[i + N]['Speed_max']
        X.append(seq)
        y.append(target)
        #print(f'X {X}')
        #print(f'y {y}')

#print(resampled_df.head(5))
#print(resampled_df.tail(5))
