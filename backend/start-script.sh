#!/bin/bash

node src/server.js
node src/gtfs-realtime/realtimeConsumer.js
node src/gtfs-realtime/realtimeProducer.js
node src/gtfs-realtime/VerhicleUpdateConsumer.js
node src/gtfs-realtime/VehincleUpdateProducer.js
