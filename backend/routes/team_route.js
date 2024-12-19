const express = require("express");
const teamRouter = express.Router();
const Team = require("../models/Team");
const User = require("../models/User");

teamRouter.post("/create", async (req, res) => {
  const { teamName, email } = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    if (user.team) {
      return res.json({ success: false, message: "You are already in a team." });
    }
    const team = await Team.create({
      teamName,
      leader: user._id,
      members: [user._id],
    });
    user.team = team._id;
    await user.save();
    return res.json({ success: true, message: "Team created successfully!", team });
  } catch (error) {
    return res.json({ success: false, message: "Server error", error: error.message });
  }
});
teamRouter.post("/join", async (req, res) => {
  const { teamName, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.team) {
      return res.json({ success: false, message: "You are already in a Team" });
    }

    const team = await Team.findOne({ name: teamName });
    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    team.members.push(user._id);
    await team.save();

    user.team = team._id;
    await user.save();

    return res.json({ success: true, message: "Joined team successfully", team });
  } catch (error) {
    return res.json({ success: false, message: "ServerError", error: error.message });
  }
});

// teamRouter.post("/leave", async (req, res) => {
//   const { email, teamName } = req.body;
//   try {
//     const user = await User.findOne({ email }).populate("team");
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }
//     if (!user.team) {
//       return res.json({ success: false, message: "You are not in a Team" });
//     }

//     const team = await Team.findOne({ name: teamName, _id: user.team._id });
//     if (!team) {
//       return res.json({ success: false, message: "Team not found" });
//     }

//     // Remove user from team members
//     team.members = team.members.filter((member) => member.toString() !== user._id.toString());

//     if (team.leader.toString() === user._id.toString()) {
//       await team.deleteOne();
//       user.team = null;
//       await user.save();
//       return res.json({ success: true, message: "You left and Your Team is Collapsed" });
//     }

//     await team.save();
//     user.team = null;
//     await user.save();
//     return res.json({ success: true, message: "You left the Team Successfully" });
//   } catch (error) {
//     return res.json({ success: false, message: `ServerError ${error}`, error: error.message });
//   }
// });
teamRouter.post("/leave", async (req, res) => {
  const { email } = req.body; // No need for teamName here
  try {
    // Find the user and populate their team
    const user = await User.findOne({ email }).populate("team");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (!user.team) {
      return res.json({ success: false, message: "You are not in a Team" });
    }

    // Find the team the user is a part of using the user's team ID
    const team = await Team.findOne({ _id: user.team._id });
    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    // Remove user from team members
    team.members = team.members.filter((member) => member.toString() !== user._id.toString());

    // If the user is the leader, delete the team
    if (team.leader.toString() === user._id.toString()) {
      await team.deleteOne();
      user.team = null;
      await user.save();
      return res.json({ success: true, message: "You left and Your Team is Collapsed" });
    }

    // Save the changes to the team and the user
    await team.save();
    user.team = null;
    await user.save();
    return res.json({ success: true, message: "You left the Team Successfully" });
  } catch (error) {
    return res.json({ success: false, message: `ServerError ${error}`, error: error.message });
  }
});





module.exports= teamRouter;