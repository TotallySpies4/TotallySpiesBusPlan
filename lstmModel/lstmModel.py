from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from model import X_train

# Anzahl der Features in Ihren Daten festlegen
n_features = X_train.shape[2]  # X_train ist Ihr Trainingsdatensatz

# LSTM-Modell initialisieren
model = Sequential()

# Erste LSTM-Schicht, 'return_sequences=True' für Stapelung von LSTM-Schichten
model.add(LSTM(units=50, return_sequences=True, input_shape=(None, n_features)))
model.add(Dropout(0.2))  # Dropout zur Vermeidung von Overfitting

# Weitere LSTM-Schichten
model.add(LSTM(units=50, return_sequences=True))
model.add(Dropout(0.2))

# Letzte LSTM-Schicht, 'return_sequences=False' da dies die letzte LSTM-Schicht ist
model.add(LSTM(units=50))
model.add(Dropout(0.2))

# Dichte-Schicht für die Ausgabe
# Die Anzahl der Ausgabeeinheiten hängt von der Anzahl der vorherzusagenden Werte ab
# Hier als Beispiel 3 (für 30, 60 und 120 Minuten Vorhersagen)
model.add(Dense(units=3))

# Modell kompilieren
model.compile(optimizer='adam', loss='mean_squared_error')

# Zusammenfassung des Modells anzeigen
model.summary()
