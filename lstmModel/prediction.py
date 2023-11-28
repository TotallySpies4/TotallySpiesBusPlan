import pandas as pd
from keras.models import load_model
from joblib import load
import logging
import numpy as np
from Data_Prep.createSequence import createSequence

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
import tensorflow as tf

tf.config.run_functions_eagerly(True)
# Model and scaler
model = load_model('lstm_model.h5')
scaler = load('scaler.joblib')
speed_scaler = load('speed_scaler.joblib')

logging.info(f"Start processing data")

# Data preprocessing
file_name = ['2023-11-22_resampled.csv', '2023-11-23_resampled.csv', '2023-11-24_resampled.csv']

resampled_df = pd.concat([pd.read_csv(file) for file in file_name])

resampled_df = resampled_df.dropna()
features_to_scale = ['Latitude_mean', 'Longitude_mean', 'Bearing_mean']
resampled_df[features_to_scale] = scaler.transform(resampled_df[features_to_scale])  # Nur transform verwenden
resampled_df['Speed_mean'] = speed_scaler.transform(resampled_df['Speed_mean'].values.reshape(-1, 1))
print(resampled_df)

# Create sequences
logging.info("Start creating sequences")
X, _, _,trip_ids,segments= createSequence(5, features_to_scale, resampled_df)
X = np.array(X)
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
    '30_min_prediction': pred_30_denormalized.flatten(),  # .flatten(), um aus 2D zu 1D zu machen
    '60_min_prediction': pred_60_denormalized.flatten()
})


print(prediction_df)

