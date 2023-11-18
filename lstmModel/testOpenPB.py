import gtfs_pb2

# Create an instance of the top-level message
feed_message = gtfs_pb2.FeedMessage()

# Read the .pb file and parse it
with open('./klt-vehiclepositions-2021-01-01T00-00-00Z.pb', 'rb') as file:
    feed_message.ParseFromString(file.read())

# Now feed_message contains your deserialized data
print(feed_message)
entity_count = len(feed_message.entity)
print("Object Number:",entity_count)