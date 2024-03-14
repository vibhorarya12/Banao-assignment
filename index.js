// Importing required modules
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/Auth"); // Importing authentication routes
const PostingRoutes = require("./Routes/Posting")
const PORT = process.env.PORT || 5000; // Setting the port number

// Enabling CORS
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "*",
}));


// Loading environment variables from .env file
dotenv.config();

// Function to connect to MongoDB database
const connect_db = async () => {
    try {
      const connect = await mongoose.connect(process.env.DATABASE);
      console.log("Connected to MongoDB"); // Logging successful connection
    } catch (error) {
      console.log("Error connecting to database", error.message); // Logging connection error
    }
  };
connect_db(); // Calling the connect_db function

// Parsing JSON request bodies
app.use(express.json());

// Route for homepage
app.get("/", (req, res) => {
    res.send("vibhor arya"); // Sending a simple response
});

// Using authentication routes
app.use('/auth', authRoutes);
app.use('/post',PostingRoutes);

// Starting the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Logging server start message
});
