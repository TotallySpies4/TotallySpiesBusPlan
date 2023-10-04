import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import mongoose from 'mongoose';


// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Setting up Express and WebSocket
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });
    ws.send('Hello from server');
});

server.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
