#!/bin/bash


./wait-for-it.sh some-service:port -- echo "Service is up"
node src/gtfs-realtime/realtimeConsumer.js
node src/gtfs-realtime/realtimeProducer.js
node src/gtfs-realtime/VerhicleUpdateConsumer.js
node src/gtfs-realtime/VehincleUpdateProducer.js
