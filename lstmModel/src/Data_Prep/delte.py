from gridfs import GridFS
from pymongo import MongoClient

client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan
fs = GridFS(db)

out = fs.find_one({'filename': 'gtfs_2023-11-22.bin'})
print(out)
if out:
    fs.delete(out._id)
