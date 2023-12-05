def calculate_level(schedule_speed, route_avg_speed):
    if schedule_speed <= route_avg_speed + 5:
        if schedule_speed < route_avg_speed + 20:
            return 1  # yellow
        else:
            return 2  # red
    else:
        return 0  # green
