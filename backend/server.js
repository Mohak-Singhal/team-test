const express = require("express");
const cors = require("cors");
const app = express();

// Update the CORS configuration to allow multiple origins
const allowedOrigins = ["http://localhost:5173", "https://team-test-pi.vercel.app"]; // Add other allowed origins if needed

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

// Your routes and other middlewares
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
