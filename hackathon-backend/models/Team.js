const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamname: { type: String, required: true, unique: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  description: { type: String, default: ''},
  joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  visibility: { type: String, enum: ["public", "private"], default: "private" }, 
  

});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;