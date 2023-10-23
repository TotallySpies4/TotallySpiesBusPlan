function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }


function calculateTimeDifference(stop1, stop2) {
  const timeFormat = "HH:mm:ss"; // Specify the time format used in the stop times

  const departureTime1 = parseTime(stop1.departure_time, timeFormat);
  const arrivalTime2 = parseTime(stop2.arrival_time, timeFormat);

  // Calculate the time difference in seconds
  const timeDifference = (arrivalTime2 - departureTime1) / (1000);
  return timeDifference;
}
// Helper function to parse a time string into a Date object
function parseTime(timeString, format) {
  const [hours, minutes, seconds] = timeString.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
}

export { calculateDistance, calculateTimeDifference };