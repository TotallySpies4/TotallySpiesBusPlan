import mongoose from "mongoose";
import {Route} from "/app/shared/busline.js";





await mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
    serverSelectionTimeoutMS: 60000,
}).then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const existingTrip = await Route.find({})
    .catch((err) => console.error("MongoDB connection error:", err));
console.log("existing trip", existingTrip);
