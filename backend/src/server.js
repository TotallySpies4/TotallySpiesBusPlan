import mongoose from "mongoose";
import express from "express";
import http from "http";
import {WebSocketServer} from "ws";
import {getBusAllBusline, getBusDetails} from "./queryData/queryDbData.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server})


wss.on('connection', async (ws) => {
    console.log('Client connected');

    const busLine = await getBusAllBusline()
    ws.send(JSON.stringify({type: 'ALL_BUS_LINES', payload: busLine}))

    ws.on('message', async (message) => {
        console.log(`Received message => ${message}`);
        const data = JSON.parse(message);
        if (data.type === 'GET_BUS_LINE_DETAILS') {
            const busLineDetail = await getBusDetails(data.payload.routeId)
            ws.send(JSON.stringify({type: 'BUS_LINE_DETAILS', payload: busLineDetail}))
        }

    });

    ws.send('Hello from server!');

});

server.listen(4000, () => {
    console.log('Server started on http://localhost:4000');
});

// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
    serverSelectionTimeoutMS: 60000
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

mongoose.set('debug', true);