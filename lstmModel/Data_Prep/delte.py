from gtfs_realtime_download import fs

out = fs.find_one({'filename': 'gtfs_2023-01-05.bin'})
print(out)
if out:
    fs.delete(out._id)
