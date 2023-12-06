import mongoose from "mongoose";

mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
    serverSelectionTimeoutMS: 60000
})
    .then(() => {
        console.log('Connected to MongoDB')
        //mongoose.connection.db.dropDatabase()
            })
    .catch(err => console.error('Could not connect to MongoDB:', err));

