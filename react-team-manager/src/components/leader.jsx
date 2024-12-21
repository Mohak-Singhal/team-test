import { useState } from "react";
import axios from "axios";

const LeaderLogin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [team, setTeam] = useState(null);
  const [visibility, setVisibility] = useState("");
  const [description, setDescription] = useState(""); // For the team description
  const [showPopup, setShowPopup] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  //   const url = "https://team-test.onrender.com";
  const url = "http://localhost:3000";

  const handleAddMember = async () => {
    try {
      const response = await axios.post(url + "/api/teams/join", {
        teamName: team.name, 
        email: newMemberEmail, 
      });
  
      if (response.data.success) {
        setMessage(response.data.message); 
        setShowAddMemberPopup(false); 
        setNewMemberEmail("");
        fetchTeamDetails(email); 
      } else {
        setMessage(response.data.message); 
      }
    } catch (error) {
      setMessage("Error adding member. Please try again."); 
    }
  };
  

  const handleLogin = async () => {
    setLoading(true);
    setMessage(""); // Reset previous messages

    try {
      const response = await axios.post(url + "/api/teams/check-leader", {
        email,
      });

      if (response.data.success) {
        if (response.data.isLeader) {
          setMessage(
            `Welcome Leader! You are leading the team: ${response.data.teamName}`
          );
          setIsLeader(true);
          fetchTeamDetails(email);
        } else {
          setMessage("You are not a leader.");
        }
      } else {
        setMessage("Email not registered. Please check your email.");
      }
    } catch (error) {
      setMessage(
        "An error occurred while verifying the email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamDetails = async (email) => {
    try {
      const response = await axios.get(url + "/api/teams/list", {
        params: { email },
      });
      if (response.data.success) {
        const teamData = response.data.teams[0];
        console.log("Fetched team data:", teamData);
        setTeam(teamData);
        setVisibility(teamData.visibility);
        setDescription(teamData.description); // Set the current description of the team
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

  const updateDescription = async () => {
    try {
      const response = await axios.post(url + "/api/teams/update-description", {
        teamId: team._id,
        leaderEmail: email,
        description,
      });
      if (response.data.success) {
        setMessage("Team description updated successfully.");
        setTeam({ ...team, description }); // Update team state with the new description
      } else {
        setMessage("Error updating description. Please try again.");
      }
    } catch (error) {
      setMessage("Error updating description. Please try again.");
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
        setMessage(response.data.message);
        setTeam(null);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error dissolving team. Please try again.");
    } finally {
      setShowPopup(false);
    }
  };

  const handleRequestAction = async (userId, action) => {
    const endpoint =
      action === "approve" ? "/approve-request" : "/reject-request";
    try {
      const response = await axios.post(url + `/api/teams${endpoint}`, {
        teamId: team._id,
        userId,
        leaderEmail: email,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        fetchTeamDetails(email);
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
          <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
            Leader Login
          </h2>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
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

          {message && (
            <p className="text-center mt-4 text-gray-800">{message}</p>
          )}

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
          <p>Description: {team?.description}</p>

          <div className="mb-6">
            <label
              htmlFor="visibility"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
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

          {/* Edit Team Description Section */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Edit Team Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a new team description"
            />
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
              onClick={updateDescription}
            >
              Update Description
            </button>
          </div>
          <div className="mt-6">
            <button
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setShowAddMemberPopup(true)}
            >
              Add Member
            </button>
          </div>
          {showAddMemberPopup && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl text-center text-black font-semibold mb-4">
                  Add Team Member
                </h2>
                <label
                  htmlFor="newMemberEmail"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Enter Member's Email
                </label>
                <input
                  type="email"
                  id="newMemberEmail"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
                <div className="flex justify-between mt-6">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={handleAddMember}
                  >
                    Add Member
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                    onClick={() => setShowAddMemberPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team Leader Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Leader</h3>
            <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300 mb-4">
              <span className="font-semibold text-gray-900">
                {team?.leader?.name}
              </span>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Team Members
            </h3>
            <ul className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
              {team?.members
                .filter((member) => member._id !== team?.leader?._id)
                .map((member, index) => (
                  <li
                    key={member._id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span className="font-semibold text-gray-900">
                      {index + 1}. {member.name}
                    </span>
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
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Join Requests
            </h3>
            <ul className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
              {team?.joinRequests.map((request, index) => (
                <li
                  key={request._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span className="font-semibold text-gray-900">
                    {index + 1}. {request.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                      onClick={() =>
                        handleRequestAction(request._id, "approve")
                      }
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl text-center font-semibold mb-4">
              Confirm Team Dissolution
            </h2>
            <p className="text-center mb-6">
              Are you sure you want to dissolve the team? This action cannot be
              undone.
            </p>
            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={handleDissolveTeam}
              >
                Yes, Dissolve
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderLogin;
