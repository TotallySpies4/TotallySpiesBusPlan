from pymongo import MongoClient

print("Hello from Python")
client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan
print(db)
