const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_CONN;

mongoose.connect("mongodb://localhost:27017/server")
    .then(() => {
        console.log('MongoDB Connected...');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    })