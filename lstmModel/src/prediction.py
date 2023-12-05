import pandas as pd
from keras.models import load_model
from joblib import load
import logging
import numpy as np
from pymongo import MongoClient

from Data_Prep.createSequence import createSequence
import tensorflow as tf

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
tf.config.run_functions_eagerly(True)

client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan
trips = db['trips']
segmentsPred = db['segmentspeedpredictions']

# Model and scaler
model = load_model('model.h5')
scaler = load('scaler.joblib')
speed_scaler = load('speed_scaler.joblib')

logging.info(f"Start processing data")

# Data preprocessing
file_name = ['2023-11-22_resampled.csv', '2023-11-23_resampled.csv', '2023-11-24_resampled.csv']

resampled_df = pd.concat([pd.read_csv(file) for file in file_name])
resampled_df = resampled_df.dropna()
print(resampled_df)
features_to_scale = ['Latitude_mean','Longitude_mean', 'Bearing_mean']
resampled_df[features_to_scale] = scaler.transform(resampled_df[features_to_scale])
resampled_df['Speed_mean'] = speed_scaler.transform(resampled_df['Speed_mean'].values.reshape(-1, 1))
print(resampled_df)

# Create sequences
logging.info("Start creating sequences")
X, _, _, trip_ids, segments = createSequence(5, features_to_scale, resampled_df)

X = np.array(X)
#X = X[:, :, :2]
print(X.shape)
print(X)

# Predict
logging.info("Start making predictions")
predictions = model.predict(X)

pred_30_denormalized = speed_scaler.inverse_transform(predictions[:, 0].reshape(-1, 1))
pred_60_denormalized = speed_scaler.inverse_transform(predictions[:, 1].reshape(-1, 1))

trip_ids_int = [int(id) for id in trip_ids]
prediction_df = pd.DataFrame({
    'Trip_ID': trip_ids_int,
    'Segment': segments,
    '30_min_prediction': pred_30_denormalized.flatten(),
    '60_min_prediction': pred_60_denormalized.flatten()
})
prediction_df.to_csv('predictedData.csv', index=False)

# Store in database
logging.info("Start storing predictions in database")

for index, row in prediction_df.iterrows():

    segmentsPred.update_one(
        {'trip_id': str(int(row['Trip_ID'])), 'segment_number': int(row['Segment'])},
        {'$set': {'speed_30_min_prediction': int(row['30_min_prediction']), 'speed_60_min_prediction': int(row['60_min_prediction'])}}
    )

logging.info("Done. Stored predictions in database")

#print(predictions)
#print(set(prediction_df['Trip_ID']))
#print(len(set(prediction_df['Trip_ID'])))
#print(prediction_df)
