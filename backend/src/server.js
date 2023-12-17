import mongoose from "mongoose";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import {
    getBusAllBuslineAmsterdam,
    getBusAllBuslineStockholm,
    getBusDetails
} from "./queryData/queryDbData.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let currentRouteId = null; // Variable, um die aktuell angefragte Route ID zu speichern
let lastBusLineDetail = null; // Variable, um die letzten Busliniendetails zu speichern

wss.on('connection', async (ws) => {
    console.log('Client connected');

    // Senden aller Buslinien an den Client
    const busLineAmsterdam = await getBusAllBuslineAmsterdam();
    const busLineStockholm = await getBusAllBuslineStockholm();
    ws.send(JSON.stringify({ type: 'ALL_BUS_LINES', payload: { amsterdam: busLineAmsterdam, stockholm: busLineStockholm } }));

    ws.on('message', async (message) => {
        console.log(`Received message => ${message}`);
        const data = JSON.parse(message);

        if (data.type === 'GET_BUS_LINE_DETAILS') {
            currentRouteId = data.payload.routeId; // Speichern der aktuellen Route ID
            const busLineDetail = await getBusDetails(currentRouteId);
            lastBusLineDetail = busLineDetail; // Speichern der aktuellen Busliniendetails
            ws.send(JSON.stringify({ type: 'BUS_LINE_DETAILS', payload: busLineDetail }));
        }
    });

    ws.send('Hello from server!');
});

async function pollDatabaseForUpdates() {
    if (currentRouteId) {
        try {
            const busLineDetail = await getBusDetails(currentRouteId);
            if (JSON.stringify(busLineDetail) !== JSON.stringify(lastBusLineDetail)) {
                console.log('Sending updated bus line details to all clients');
                wss.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({ type: 'BUS_LINE_DETAILS', payload: busLineDetail }));
                    }
                });
                lastBusLineDetail = busLineDetail; // Aktualisieren der gespeicherten Details
            }
        } catch (error) {
            console.error('Error fetching updates from the database:', error);
        }
    }
}

// Regelmäßiges Polling der Datenbank in einem Intervall (z.B. alle 30 Sekunden)
setInterval(pollDatabaseForUpdates, 30000);

server.listen(4000, () => {
    console.log('Server started on http://localhost:4000');
});

// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
    serverSelectionTimeoutMS: 60000
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('Could not connect to MongoDB:', err));

mongoose.set('debug', true);
