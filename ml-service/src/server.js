import mongoose from "mongoose";
import express from "express";
import http from "http";
import {WebSocketServer} from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server})


wss.on('connection', async (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        console.log(`Received message => ${message}`);
    });

    ws.send('Hello from machine learning!');

});

server.listen(6000, () => {
    console.log('Server started on http://localhost:6000');
});

// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
    serverSelectionTimeoutMS: 60000
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

mongoose.set('debug', true);