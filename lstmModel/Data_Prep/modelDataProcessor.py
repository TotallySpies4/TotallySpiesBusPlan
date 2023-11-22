import pandas as pd
from pymongo import MongoClient
import logging
from gtfs_realtime_download import fs
from segmentSpecifier import calculate_current_segment

client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan

file_name = 'gtfs_2023-01-02.csv'
csv = fs.find_one({'filename': file_name})
stoptimes_collection = db['stoptimes']
trip_collection = db['trips']

processed_df = pd.DataFrame()

chunk_size = 10000000  # Adjust this size to a suitable value for your system's memory

logging.info(f" Start processing file: {csv}")
for chunk in pd.read_csv(csv, chunksize=chunk_size):
    logging.info(f"Processing chunk of size {chunk_size}")
    chunk = chunk.dropna(subset=['Trip ID'])

    # Initialize an empty list to store trip_ids to drop for this chunk
    trip_ids_to_drop = []

    logging.info(f"Sorting out trip ids not found in the database")
    for trip_id in chunk['Trip ID'].unique():
        # print(f'trip id type {str(int(trip_id))}')

        found_trip = trip_collection.find_one({'trip_id': str(int(trip_id))})
        # if found_trip is not None:
        # print(f'found trip {found_trip}')

        if found_trip is None:
            # print('trip not found in the database')
            trip_ids_to_drop.append(trip_id)

    chunk = chunk[~chunk['Trip ID'].isin(trip_ids_to_drop)]

    logging.info(f"Calculating segments for {len(chunk)} rows")
    for index, row in chunk.iterrows():
        latitude = row['Latitude']
        longitude = row['Longitude']
        vehicle_bearing = row['Bearing']
        trip_id = str(int(row['Trip ID']))

        # print(f'latitude {latitude} type {type(latitude)}')
        # print(f'longitude {longitude} type {type(longitude)}')
        # print(f'vehicle_bearing {vehicle_bearing} type {type(vehicle_bearing)}')

        current_segment = calculate_current_segment(latitude, longitude, vehicle_bearing, trip_id)

        chunk.at[index, 'Segment'] = current_segment
    logging.info(f"Finished calculating segments for {len(chunk)} rows")
    logging.info(f"Appending chunk to processed_df")

    chunk.sort_values(by=['Trip ID', 'Segment'], inplace=True)
    chunk = chunk.dropna(subset=['Segment'])
    processed_df = pd.concat([processed_df, chunk], ignore_index=True)

    logging.info(f"Finished processing chunk of size {chunk_size}")

logging.info(f"Finished processing file: {csv}")
logging.info(f'Aggregate data point to 10min frames')

# Convert the timestamp to a datetime object and set it as the index
processed_df['Timestamp'] = pd.to_datetime(processed_df['Timestamp'], unit='s')
processed_df.set_index('Timestamp', inplace=True)

# Resample the data in 10-minute steps
resampled_df = processed_df.resample('10T').agg({
    'Trip ID': 'first',  # Assuming 'Trip ID' is a column in processed_df
    'Segment': 'first',  # Assuming 'Segment' is a column in processed_df
    'Latitude': 'mean',
    'Longitude': 'mean',
    'Bearing': 'mean',
    'Speed': ['mean', 'max']
})

resampled_df.columns = ['_'.join(col) if type(col) is tuple else col for col in resampled_df.columns]

# Assuming N is defined
N = 5  # Number of past segments to consider for the prediction

X, y = [], []
# Group by 'Trip ID'
for trip_id, group in resampled_df.groupby('Trip ID_first'):
    # Make sure group is sorted by 'Segment'
    group = group.sort_values(by='Segment')

    # Now create sequences for LSTM
    for i in range(N, len(group) - N):
        # Create sequences using the mean values of the features
        seq = group.iloc[i - N:i][['Latitude_mean', 'Longitude_mean', 'Bearing_mean', 'Speed_mean']].values
        # Predict the speed of the next segment using the max value
        target = group.iloc[i + N]['Speed_max']
        X.append(seq)
        y.append(target)
        print(f'X {X}')
        print(f'y {y}')

print(resampled_df.head(5))
print(resampled_df.tail(5))
