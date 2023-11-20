from gridfs import GridFS
from pymongo import MongoClient

print("Hello from Python")
client = MongoClient('mongodb:27017')
db = client.TotallySpiesBusPlan
fs = GridFS(db)


def read_csv_from_gridfs(filename):
    try:
        # Find the file in GridFS
        grid_out = fs.find_one({'filename': filename})
        if grid_out:
            # Read the file's content
            contents = grid_out.read().decode('utf-8')

            # Print the contents of the CSV file
            print(contents)
        else:
            print(f"No file found with filename {filename}")
    except Exception as e:
        print(f"An error occurred: {e}")


# Replace 'your_csv_file.csv' with the actual filename of your CSV file in GridFS
read_csv_from_gridfs('gtfs_2021-01-04.csv')
