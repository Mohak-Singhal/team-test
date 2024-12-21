// const express = require("express");
// const teamRouter = express.Router();
// const Team = require("../models/Team");
// const User = require("../models/User");


// teamRouter.post("/create", async (req, res) => {
//   const { name, email } = req.body;
//   try {
//     // Check if the user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "User Not Found" });
//     }

//     // Check if the user is already in a team
//     if (user.team) {
//       return res.json({ success: false, message: "You are already in a team." });
//     }
//     const existingTeam = await Team.findOne({ name });
//     if (existingTeam) {
//       return res.json({ success: false, message: "A team with this name already exists." });
//     }


//     // Create the new team if no existing team with the same name
//     const team = await Team.create({
//       name,
//       leader: user._id,
//       members: [user._id],
//     });

//     // Assign the team to the user
//     user.team = team._id;
//     await user.save();

//     return res.json({ success: true, message: "Team created successfully!", team });
//   } catch (error) {
//     return res.json({ success: false, message: "Server error", error: error.message });
//   }
// });

// teamRouter.post("/join", async (req, res) => {
//   const { teamName, email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }
//     if (user.team) {
//       return res.json({ success: false, message: "You are already in a Team" });
//     }

//     const team = await Team.findOne({ name: teamName });
//     if (!team) {
//       return res.json({ success: false, message: "Team not found" });
//     }
//     if (team.members.length >= 5) {
//       return res.json({ success: false, message: "Team is already full (5 members)." });
//     }


//     team.members.push(user._id);
//     await team.save();

//     user.team = team._id;
//     await user.save();

//     return res.json({ success: true, message: "Joined team successfully", team });
//   } catch (error) {
//     return res.json({ success: false, message: "ServerError", error: error.message });
//   }
// });


// teamRouter.post("/leave", async (req, res) => {
//   const { email } = req.body; // No need for teamName here
//   try {
//     // Find the user and populate their team
//     const user = await User.findOne({ email }).populate("team");
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }
//     if (!user.team) {
//       return res.json({ success: false, message: "You are not in a Team" });
//     }

//     // Find the team the user is a part of using the user's team ID
//     const team = await Team.findOne({ _id: user.team._id });
//     if (!team) {
//       return res.json({ success: false, message: "Team not found" });
//     }

//     // Remove user from team members
//     team.members = team.members.filter((member) => member.toString() !== user._id.toString());

//     // If the user is the leader, delete the team
//     if (team.leader.toString() === user._id.toString()) {
//       await team.deleteOne();
//       user.team = null;
//       await user.save();
//       return res.json({ success: true, message: "You left and Your Team is Collapsed" });
//     }

//     // Save the changes to the team and the user
//     await team.save();
//     user.team = null;
//     await user.save();
//     return res.json({ success: true, message: "You left the Team Successfully" });
//   } catch (error) {
//     return res.json({ success: false, message: `ServerError ${error}`, error: error.message });
//   }
// });

// teamRouter.get("/list", async (req, res) => {
//   try {
//     const teams = await Team.find().populate("leader", "name email").populate("members", "name email");
//     return res.json({ success: true, teams });
//   } catch (error) {
//     return res.json({ success: false, message: "Server error", error: error.message });
//   }
// });





// module.exports= teamRouter;


const express = require("express");
const teamRouter = express.Router();
const Team = require("../models/Team");
const User = require("../models/User");

teamRouter.post("/create", async (req, res) => {
  const { name, email,visibility } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (user.team) {
      return res.json({ success: false, message: "You are already in a team." });
    }

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.json({ success: false, message: "A team with this name already exists." });
    }

    const teamVisibility = visibility || 'private';

    const team = await Team.create({
      name,
      leader: user._id,
      members: [user._id],
      joinRequests: [],
      visibility: teamVisibility,
    });

    user.team = team._id;
    await user.save();

    return res.json({ success: true, message: "Team created successfully!", team });
  } catch (error) {
    return res.json({ success: false, message: "Server error", error: error.message });
  }
});

// teamRouter.get("/list", async (req, res) => {
//   const { email } = req.query;
//   try {
//     let teams = [];

//     if (email) {
//       // If a leader's email is provided, fetch all their teams
//       const leader = await User.findOne({ email });
//       if (!leader) {
//         return res.json({ success: false, message: "Leader not found" });
//       }

//       // Fetch teams where the leader is the owner
//       teams = await Team.find({ leader: leader._id })
//       .select("name description visibility")
//         .populate("leader", "name email")
//         .populate("members", "name email")
//         .populate("joinRequests", "name email");
//     } else {
//       // Fetch only public teams for general users
//       teams = await Team.find({ visibility: "public" })
//         .populate("leader", "name email")
//     }

//     return res.json({ success: true, teams });
//   } catch (error) {
//     return res.json({ success: false, message: "Server error", error: error.message });
//   }
// });
// teamRouter.get("/list", async (req, res) => {
//   const { email } = req.query; // Email (optional)

//   try {
//     let teams = [];

//     if (email) {
//       // Check if user exists
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.json({ success: false, message: "User Not Found" });
//       }

//       // Check if the user is a leader
//       if (user._id) {
//         const leaderTeams = await Team.find({ leader: user._id })
//           .select("description")
//           .populate("leader", "name email")
//           .populate("members", "name email")
//           .populate("joinRequests", "name email");

//         if (leaderTeams.length > 0) {
//           return res.json({ success: true, teams: leaderTeams });
//         }
//       }

//       // Check if the user is a member of a team
//       const memberTeams = await Team.find({ members: user._id })
//         .populate("leader", "name email")
//         .populate("members", "name email");

//       if (memberTeams.length > 0) {
//         return res.json({ success: true, teams: memberTeams });
//       }

//       // If not a leader or a member, return error
//       return res.json({ success: false, message: "You are not in any team." });
//     } else {
//       // Fetch only public teams
//       teams = await Team.find({ visibility: "public" })
//         .populate("leader", "name email");

//       return res.json({ success: true, teams });
//     }
//   } catch (error) {
//     return res.json({ success: false, message: "Server error", error: error.message });
//   }
// });
teamRouter.get("/list", async (req, res) => {
  const { email } = req.query; // Leader's email (optional)
  try {
    let teams = [];

    if (email) {
      // If a leader's email is provided, fetch all their teams
      const leader = await User.findOne({ email });
      if (!leader) {
        return res.json({ success: false, message: "Leader not found" });
      }

      // Fetch teams where the leader is the owner
      teams = await Team.find({ leader: leader._id })
        .populate("leader", "name email")
        .populate("members", "name email")
        .populate("joinRequests", "name email")
        .select("name description") 
    } else {
      // Fetch only public teams for general users
      teams = await Team.find({ visibility: "public" })
        .populate("leader", "name email")
        .select("name description visibility"); 
    }

    return res.json({ success: true, teams });
  } catch (error) {
    return res.json({ success: false, message: "Server error", error: error.message });
  }
});
teamRouter.post("/request-join", async (req, res) => {
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
    if (team.visibility === "private") {
      return res.json({ success: false, message: "This team is private. You cannot send a join request." });
    }

    if (team.members.length >= 5) {
      return res.json({ success: false, message: "Team is already full (5 members)." });
    }

    if (team.joinRequests.includes(user._id)) {
      return res.json({ success: false, message: "You have already requested to join this team." });
    }

    team.joinRequests.push(user._id);
    await team.save();

    return res.json({ success: true, message: "Join request sent successfully", team });
  } catch (error) {
    return res.json({ success: false, message: "Server error", error: error.message });
  }
});

teamRouter.post("/check-leader", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not registered." });
    }

    const team = await Team.findOne({ leader: user._id });
    if (team) {
      return res.json({ success: true, isLeader: true, teamName: team.name });
    } else {
      return res.json({ success: true, isLeader: false });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

teamRouter.post("/update-visibility", async (req, res) => {
  const { teamId, leaderEmail, visibility } = req.body;

  try {
    // Find the leader
    const leader = await User.findOne({ email: leaderEmail });
    if (!leader) {
      return res.json({ success: false, message: "Leader not found" });
    }

    // Find the team and verify if the user is the leader
    const team = await Team.findOne({ _id: teamId });
    if (!team || team.leader.toString() !== leader._id.toString()) {
      return res.json({ success: false, message: "You are not authorized to update this team's visibility." });
    }

    // Update the visibility status
    if (!["public", "private"].includes(visibility)) {
      return res.json({ success: false, message: "Invalid visibility option. Use 'public' or 'private'." });
    }

    team.visibility = visibility;
    await team.save();

    return res.json({
      success: true,
      message: `Team visibility updated to ${visibility}.`,
      team,
    });
  } catch (error) {
    return res.json({ success: false, message: "Server error", error: error.message });
  }
});

teamRouter.post("/approve-request", async (req, res) => {
  const { teamId, userId, leaderEmail } = req.body;
  try {
    const leader = await User.findOne({ email: leaderEmail });
    if (!leader) {
      return res.json({ success: false, message: "Invalid Id" });
    }

    const team = await Team.findOne({ _id: teamId });
    if (!team || team.leader.toString() !== leader._id.toString()) {
      return res.json({ success: false, message: "You are not authorized to approve requests for this team." });
    }

    if (team.members.length >= 5) {
      return res.json({ success: false, message: "Team is already full (5 members)." });
    }

    const userIndex = team.joinRequests.indexOf(userId);
    if (userIndex === -1) {
      return res.json({ success: false, message: "No such join request found." });
    }

    team.joinRequests.splice(userIndex, 1);
    team.members.push(userId);

    const user = await User.findOne({ _id: userId });
    user.team = team._id;
    await user.save();
    await team.save();

    return res.json({ success: true, message: "Member approved successfully", team });
  } catch (error) {
    return res.json({ success: false, message: "Server error", error: error.message });
  }
});

teamRouter.post("/reject-request", async (req, res) => {
  const { teamId, userId, leaderEmail } = req.body;
  try {
    const leader = await User.findOne({ email: leaderEmail });
    if (!leader) {
      return res.json({ success: false, message: "Leader not found" });
    }

    const team = await Team.findOne({ _id: teamId });
    if (!team || team.leader.toString() !== leader._id.toString()) {
      return res.json({ success: false, message: "You are not authorized to reject requests for this team." });
    }

    const userIndex = team.joinRequests.indexOf(userId);
    if (userIndex === -1) {
      return res.json({ success: false, message: "No such join request found." });
    }

    team.joinRequests.splice(userIndex, 1);
    await team.save();

    return res.json({ success: true, message: "Join request rejected", team });
  } catch (error) {
    return res.json({ success: false, message: "Server error", error: error.message });
  }
});

teamRouter.post("/remove-member", async (req, res) => {
  const { teamId, userId, leaderEmail } = req.body;
  try {
    const leader = await User.findOne({ email: leaderEmail });
    if (!leader) {
      return res.json({ success: false, message: "Leader not found" });
    }

    const team = await Team.findOne({ _id: teamId });
    if (!team || team.leader.toString() !== leader._id.toString()) {
      return res.json({ success: false, message: "You are not authorized to remove members from this team." });
    }

    const memberIndex = team.members.indexOf(userId);
    if (memberIndex === -1) {
      return res.json({ success: false, message: "User is not a member of the team." });
    }

    team.members.splice(memberIndex, 1);

    const user = await User.findOne({ _id: userId });
    user.team = null;
    await user.save();
    await team.save();

    return res.json({ success: true, message: "Member removed successfully", team });
  } catch (error) {
    return res.json({ success: false, message: "Server error", error: error.message });
  }
});


teamRouter.post("/leave", async (req, res) => {
  const { email } = req.body; 
  try {
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


teamRouter.get("/user-team", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email }).populate("team");
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.team) {
      return res.json({ success: false, message: "You are not part of a team" });
    }

    const team = await Team.findOne({ _id: user.team._id })
      .populate("members", "name email")
      .populate("leader", "name email");

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    return res.json({
      success: true,
      team: {
        name: team.name,
        description: team.description,
        leader: team.leader,
        members: team.members.map(member => member.name),
      },
    });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: `Server error: ${error.message}` });
  }
});

teamRouter.post("/update-description", async (req, res) => {
  const { teamId, leaderEmail, description } = req.body;
  try {
    const leader = await User.findOne({ email: leaderEmail });
    if (!leader) {
      return res.json({ success: false, message: "Leader not found" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    // Ensure only the leader can update the description
    if (team.leader.toString() !== leader._id.toString()) {
      return res.json({ success: false, message: "You are not the leader of this team" });
    }

    team.description = description;
    await team.save();

    return res.json({ success: true, message: "Description updated successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Error updating description", error: error.message });
  }
});

module.exports = teamRouter;




