from pymongo import MongoClient

#client = MongoClient('mongodb://mongodb:27017/TotallySpiesBusPlan')
client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan
print(db['trips'])
trip_id= "14010000648621468"
trip_object_id = db.trips.find_one({'trip_id': trip_id})
print(
    f'Yeahhhh it works{trip_object_id}'
)
