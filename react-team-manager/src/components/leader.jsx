import { useState } from "react";
import axios from "axios";

const LeaderLogin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [team, setTeam] = useState(null);
  const [visibility, setVisibility] = useState("");
  const [showPopup, setShowPopup] = useState(false);  // For the confirmation popup
  const url = "https://team-test.onrender.com";
//   const url = "http://localhost:3000";

  const handleLogin = async () => {
    setLoading(true);
    setMessage(""); // Reset previous messages

    try {
      const response = await axios.post(url + "/api/teams/check-leader", {
        email,
      });

      if (response.data.success) {
        if (response.data.isLeader) {
          setMessage(`Welcome Leader! You are leading the team: ${response.data.teamName}`);
          setIsLeader(true);
          fetchTeamDetails(email);
        } else {
          setMessage("You are not a leader.");
        }
      } else {
        setMessage("Email not registered. Please check your email.");
      }
    } catch (error) {
      setMessage("An error occurred while verifying the email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamDetails = async (email) => {
    try {
      const response = await axios.get(url + "/api/teams/list", { params: { email } });
      if (response.data.success) {
        const teamData = response.data.teams[0]; // Assuming the leader has one team
        setTeam(teamData);
        setVisibility(teamData.visibility);
      } else {
        setMessage("Failed to fetch team details.");
      }
    } catch (error) {
      setMessage("Error fetching team details. Please try again.");
    }
  };

  const updateVisibility = async () => {
    try {
      const response = await axios.post(url + "/api/teams/update-visibility", {
        teamId: team._id,
        leaderEmail: email,
        visibility,
      });
      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error updating visibility. Please try again.");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (team.leaderEmail === email && team.leaderEmail === userId) {
      alert("You cannot remove yourself as the leader!");
      return;
    }
    try {
      const response = await axios.post(url + "/api/teams/remove-member", {
        teamId: team._id,
        userId,
        leaderEmail: email,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        fetchTeamDetails(email); // Refresh team details
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error removing member. Please try again.");
    }
  };

  const handleDissolveTeam = async () => {
    try {
      const response = await axios.post(url + "/api/teams/leave", { email });
      if (response.data.success) {
        setMessage(response.data.message);  // Show success message
        setTeam(null);  // Reset the team data
        // Optionally, you can also redirect the user to another page or clear any other state
      } else {
        setMessage(response.data.message);  // Show error message if any
      }
    } catch (error) {
      setMessage("Error dissolving team. Please try again.");
    } finally {
      setShowPopup(false);  // Close the confirmation popup
    }
  };
  

  const handleRequestAction = async (userId, action) => {
    const endpoint = action === "approve" ? "/approve-request" : "/reject-request";
    try {
      const response = await axios.post(url + `/api/teams${endpoint}`, {
        teamId: team._id,
        userId,
        leaderEmail: email,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        fetchTeamDetails(email); // Refresh team details
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error processing request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!isLeader ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Leader Login</h2>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && <p className="text-center mt-4 text-gray-800">{message}</p>}

          <div className="mt-6">
            <button
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
          <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
            Team: {team?.name}
          </h2>

          <div className="mb-6">
            <label htmlFor="visibility" className="block text-lg font-medium text-gray-700 mb-2">
              Team Visibility
            </label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
              onClick={updateVisibility}
            >
              Update Visibility
            </button>
          </div>

          {/* Team Leader Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Leader</h3>
            <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300 mb-4">
              <span className="font-semibold text-gray-900">{team?.leader?.name}</span>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Team Members</h3>
            <ul className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
              {team?.members
                .filter(member => member._id !== team?.leader?._id)  // Filter out leader from members list
                .map((member, index) => (
                  <li key={member._id} className="flex justify-between items-center border-b py-2">
                    <span className="font-semibold text-gray-900">{index + 1}. {member.name}</span>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      Remove
                    </button>
                  </li>
              ))}
            </ul>
          </div>

          {/* Join Requests Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Join Requests</h3>
            <ul className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
              {team?.joinRequests.map((request, index) => (
                <li key={request._id} className="flex justify-between items-center border-b py-2">
                  <span className="font-semibold text-gray-900">{index + 1}. {request.name}</span>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                      onClick={() => handleRequestAction(request._id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => handleRequestAction(request._id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Dissolve Team Button */}
          <div className="mt-6">
            <button
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => setShowPopup(true)}
            >
              Dissolve Team
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to dissolve the team?</h3>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 mr-4"
              onClick={handleDissolveTeam}
            >
              Yes, dissolve
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderLogin;
