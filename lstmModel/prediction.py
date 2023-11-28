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
model = load_model('mein_lstm_modell.h5')
scaler = load('mein_scaler.joblib')

date = '2023-11-23'
date2 = '2023-11-24'
logging.info(f"Start processing data for {date}")

# Data preprocessing
#resampled_df_unclean = process_resample_data_from_file(date, 10000000)
#resampled_df_unclean2 = process_resample_data_from_file(date2, 10000000)
#resampled_df1 = resampled_df_unclean.dropna()
resampled_df_unclean = pd.read_csv('./2023-11-23_resampled.csv')
resampled_df = resampled_df_unclean.dropna()
resampled_df.to_csv('predictPrep.csv')
features_to_scale = ['Latitude_mean', 'Longitude_mean', 'Bearing_mean', 'Speed_mean']
resampled_df[features_to_scale] = scaler.transform(resampled_df[features_to_scale])  # Nur transform verwenden
print(resampled_df)

# Create sequences
logging.info("Start creating sequences")
X, _, _ = createSequence(5, features_to_scale, resampled_df)
X = np.array(X)
print(X.shape)
print(X)

# Predict
logging.info("Start making predictions")
#predictions = model.predict(X)

# Denormalize the predictions
#pred_denormalized = scaler.inverse_transform(predictions)

#print(pred_denormalized)
