from gridfs import GridFS
from pymongo import MongoClient


def calculate_level(schedule_speed, route_avg_speed):
    if schedule_speed > route_avg_speed + 5:
        return 0  # green
    elif schedule_speed > route_avg_speed - 5:
        return 1  # yellow
    else:
        return 2  # red

