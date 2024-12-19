const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const connectDB = require("./databases");
const teamRouter = require('./routes/team_route');
const userRouter = require("./routes/user_route");

dotenv.config();
connectDB();

const app = express();

// List of allowed origins
const allowedOrigins = ["http://localhost:5173", "https://team-test-pi.vercel.app"]; // Add other allowed origins if needed

// CORS middleware to allow multiple origins
app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
}));

// Middleware to parse JSON data
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/teams", teamRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
