require('dotenv').config()
const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");
const { unknownEndpoint,errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Middlewares
app.use(cors())
app.use(express.json());

connectDB(); 

// Use the jobRouter for all "/jobs" routes
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;