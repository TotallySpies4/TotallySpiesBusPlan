from keras.models import load_model
from joblib import load
import logging
import numpy as np
from Data_Prep.createSequence import createSequence
from Data_Prep.modelDataProcessor import process_resample_data_from_file

# Model and scaler
model = load_model('mein_lstm_modell.h5')
scaler = load('mein_scaler.joblib')

date = '2023-01-05'
logging.info(f"Start processing data for {date}")

# Data preprocessing
resampled_df_unclean = process_resample_data_from_file(date, 10000000)
print(resampled_df_unclean.head())
#resampled_df = resampled_df_unclean.dropna()
#features_to_scale = ['Latitude_mean', 'Longitude_mean', 'Bearing_mean', 'Speed_mean']
#resampled_df[features_to_scale] = scaler.transform(resampled_df[features_to_scale])  # Nur transform verwenden

# Create sequences
logging.info("Start creating sequences")
#X, _, _ = createSequence(5, features_to_scale, resampled_df)
#X = np.array(X)  # Umwandeln in ein NumPy-Array

# Predict
logging.info("Start making predictions")
#predictions = model.predict(X)

# Denormalize the predictions
#pred_denormalized = scaler.inverse_transform(predictions)

#print(pred_denormalized)
