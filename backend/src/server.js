require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Request logger with status and duration
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} [${res.statusCode}] - ${duration}ms`);
    });
    next();
});

const apiRouter = require('./routers/index');

app.use("/api", apiRouter);

app.get("/", (req, res) => res.send("Library System API is running"));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ 
        message: "Internal Server Error", 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Handle unhandled Promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection at: ${promise}`, 'reason:', err);
    // server.close(() => process.exit(1)); // Optional: close server
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // process.exit(1); // Optional: exit process
});
