import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
import tensorflow as tf
from tensorflow import keras as keras
from keras.models import Sequential
from keras.layers import LSTM, Dense

# Load the CSV file
data = pd.read_csv("congestionLevel.csv")  # No data here now

# Filter data for a specific bus route -> need function to get bus route
bus_route = "bus_route"
subset_data = data[data["Bus Route"] == bus_route].copy()

# Preprocess the data
label_encoder = LabelEncoder()
subset_data["Road Segment"] = label_encoder.fit_transform(subset_data["Road Segment"])

scaler = StandardScaler()
subset_data["Timestamp"] = scaler.fit_transform(
    subset_data["Timestamp"].values.reshape(-1, 1)
)

# Prepare the input features and target values
input_features = ["Timestamp", "Road Segment"]
target_feature = "Speed"

X = subset_data[input_features].values
Y = subset_data[target_feature].values

# Split the data into training and testing sets (if needed)
train_size = int(0.8 * len(X))
X_train = X[:train_size]
Y_train = Y[:train_size]
X_test = X[train_size:]
Y_test = Y[train_size:]

# Build the LSTM model
model = Sequential()
model.add(LSTM(64, input_shape=(X_train.shape[1], 1)))
model.add(Dense(1))
model.compile(loss="mean_squared_error", optimizer="adam")

# Train the LSTM model
model.fit(X_train, Y_train, epochs=10, batch_size=32)

# Make predictions on the testing data
test_predictions = model.predict(X_test)
test_predictions = scaler.inverse_transform(test_predictions)

# Evaluate the model performance on the test data
loss, accuracy = model.evaluate(X_test, Y_test, verbose=0)
print("Test Loss:", loss)
print("Test Accuracy:", accuracy)

# Predict congestion level for new data
new_data = pd.read_csv("new_data.csv")  # Replace with the filepath of your new data
new_data["Road Segment"] = label_encoder.transform(new_data["Road Segment"])
new_data["Timestamp"] = scaler.transform(new_data["Timestamp"].values.reshape(-1, 1))
X_new = new_data[input_features].values
X_new = X_new.reshape(X_new.shape[0], X_new.shape[1], 1)

new_predictions = model.predict(X_new)

# Save the subset data with predictions to a new CSV file
subset_data["Predictions"] = new_predictions
subset_data.to_csv("subset_data_predictions.csv", index=False)


# # Save the realtime data
# def collect_realtime_data():
#     # Code to collect realtime data
#     return realtime_data


# today_realtime_data = collect_realtime_data()

# # Reshape the real-time data for comparison
# today_realtime_data = today_realtime_data.reshape(1, 1)

# # Inverse scale the real-time data
# today_realtime_data = scaler.inverse_transform(today_realtime_data)

# # Get the predicted congestion level for today
# today_predicted_data = new_predictions[-1]

# # Compare the predicted congestion level with the actual real-time data for today
# print("Today's predicted speed:", today_predicted_data[0])
# print("Today's actual speed:", today_realtime_data[0][0])
