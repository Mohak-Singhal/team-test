const express =require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const connectDB =require("./databases");
const teamRouter= require('./routes/team_route');
const userRouter = require("./routes/user_route");


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://team-test-pi.vercel.app"]
}));
//middleware
app.use(express.json())
app.use("/api/users", userRouter);
app.use("/api/teams", teamRouter);
app.get("/", (req, res) => {
    res.send("API is running...");
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
