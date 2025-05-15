require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const speechRoutes = require('./routes/speech');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.path} ${req.method}`);
    next();
});

app.use('/api/speech', speechRoutes);

// connect to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(
                `Connected to database and listening on port ${process.env.PORT}`
            );
        });
    })
    .catch((err) => {
        console.error(err);
    });
