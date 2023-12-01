import pandas as pd


df = pd.read_csv('../2023-01-03_resampled.csv')
# Convert 'Timestamp' to datetime
df['Timestamp'] = pd.to_datetime(df['Timestamp'])

# Set 'Timestamp' as the index
df.set_index('Timestamp', inplace=True)

# Resample to 1-minute intervals
resampled_df = df.resample('1T').agg({
    'Trip ID': 'first',  # or 'mean' if Trip ID is numerical and you want the average
    'Segment': 'first',  # Keeps the first segment value in each minute
    'Latitude': 'mean',  # Average latitude for the minute
    'Longitude': 'mean',  # Average longitude for the minute
    'Bearing': 'mean',  # Average bearing for the minute
    'Speed': 'mean',  # Average speed for the minute
})

# Reset the index if you want 'Timestamp' back as a column
resampled_df.reset_index(inplace=True)
resampled_df.rename(columns={
    'Trip ID': 'Trip ID_first',
    'Segment': 'Segment_first',
    'Latitude': 'Latitude_mean',
    'Longitude': 'Longitude_mean',
    'Bearing': 'Bearing_mean',
    'Speed': 'Speed_mean'
}, inplace=True)

# Save the resampled DataFrame to a new CSV file
resampled_df.to_csv('2023-01-03_resampled.csv', index=False)