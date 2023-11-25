from keras.models import load_model
from joblib import load

model = load_model('mein_lstm_modell.h5')
scaler = load('mein_scaler.joblib')
