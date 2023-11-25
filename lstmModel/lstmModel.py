import numpy as np
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from model import X_train
import pandas as pd
from sklearn.model_selection import train_test_split

# Load the data from the file system
resampled_df_unclean = pd.read_csv('resampled_df.csv')
resampled_df = resampled_df_unclean.dropna(inplace=True)

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


N = 5  # Number of past segments to consider for the prediction

X = []
y_30, y_60, y_120 = [], [], []

for trip_id, group in resampled_df.groupby('Trip ID_first'):
    group = group.sort_values(by=['Timestamp', 'Segment_first'])
    for i in range(N, len(group) - 120):  # Stellen Sie sicher, dass Sie genug Daten für 120 Minuten in die Zukunft haben
        seq = group.iloc[i - N:i][['Latitude_mean', 'Longitude_mean', 'Bearing_mean', 'Speed_mean']].values
        y_30.append(group.iloc[i + 30]['Speed_max'])  # Geschwindigkeit in 30 Minuten
        y_60.append(group.iloc[i + 60]['Speed_max'])  # Geschwindigkeit in 60 Minuten
        y_120.append(group.iloc[i + 120]['Speed_max'])  # Geschwindigkeit in 120 Minuten
        X.append(seq)

# Umwandeln in NumPy-Arrays
X = np.array(X)
y_30 = np.array(y_30)
y_60 = np.array(y_60)
y_120 = np.array(y_120)


# Definieren Sie die Anzahl der Features
n_features = X_train.shape[2]

# Initialisieren Sie das Sequential-Modell
model = Sequential()
model.add(LSTM(units=50, return_sequences=True, input_shape=(N, n_features)))
model.add(LSTM(units=50))
model.add(Dense(units=1))  # Da Sie Geschwindigkeit vorhersagen, ist nur eine Ausgabe erforderlich

# Kompilieren Sie das Modell
model.compile(optimizer='adam', loss='mean_squared_error')