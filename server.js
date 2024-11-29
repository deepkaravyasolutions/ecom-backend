const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotEnv = require("dotenv");

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

const app = express();
dotEnv.config();

// Middleware
app.use(cors({
    origin: '*',
    credentials: false
}));

app.use(bodyParser.json());

// Basic route
app.get("/", (req, res) => { 
    res.send("Hello Home Route")
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

// MongoDB Connection with better error handling
const connectDB = async () => {
    try {
        const DB_URI = process.env.DB_URI.replace("<db_password>", process.env.DB_PASSWORD);

        // Add connection options
        const options = {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(DB_URI);
        console.log('MongoDB Connected Successfully!');
        
        // Listen for errors after initial connection
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected!');
        });

    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});