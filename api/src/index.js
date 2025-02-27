// Modules
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./db/connection");

const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Connect to DB
connectDB();

// Routes
app.get("/", (req, res) => {
    res.send("Interview Experience API");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});