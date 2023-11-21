from gtfs_realtime_download import fs

out = fs.find_one({'filename': 'gtfs_2021-01-04.csv'})
print(out)
if out:
    fs.delete(out._id)
