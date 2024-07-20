const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors module

dotenv.config(); // Load environment variables from .env file

const nhifRoutes = require("./routes/nhifRoutes");

const app = express();
app.use(express.json());

// CORS middleware setup
app.use(cors());

const mongoUri = process.env.MONGODB_URI;
mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.use("/api", nhifRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
