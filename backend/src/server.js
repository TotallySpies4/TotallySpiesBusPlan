import mongoose from "mongoose";
import express from "express";
import http from "http";
import {WebSocketServer} from "ws";
import {BusRoute} from "./DBmodels/busline.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server})

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
    });

    ws.send('Hello from server!');
    sendBusStops(ws)
        .then(r => console.log('Bus stops sent to client.'))
        .catch(console.error);
});

// Senden Sie hier die Busstop-Daten an den Client, wenn er sich verbindet
async function sendBusStops(ws) {
    try {
        const busstops = await BusRoute.find({route_short_name: '1'});
        ws.send(JSON.stringify(busstops));
    } catch (error) {
        console.error('Error fetching bus stops:', error);
    }
}
server.listen(4000, () => {
    console.log('Server started on http://localhost:4000');
});

// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

