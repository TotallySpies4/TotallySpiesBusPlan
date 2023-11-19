import pandas as pd
from datetime import datetime

# Read your CSV file into a pandas DataFrame
df = pd.read_csv('vehicle_positions.csv')

# Assuming your timestamp column is named 'Timestamp'
df['Timestamp'] = pd.to_datetime(df['Timestamp'], unit='s')  # Convert timestamp to datetime

# Extract date, time, and day of the week
df['Date'] = df['Timestamp'].dt.strftime('%Y-%m-%d')
df['Time'] = df['Timestamp'].dt.strftime('%H:%M:%S')
df['Day_of_Week'] = df['Timestamp'].dt.strftime('%A')

# Save the updated DataFrame to a new CSV file
df.to_csv('train_data.csv', index=False)
