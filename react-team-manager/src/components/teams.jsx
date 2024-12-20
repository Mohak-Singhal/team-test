import { useState } from "react";
import axios from "axios";

const Teams = () => {
  const [showForm, setShowForm] = useState(false);
  const [teamData, setTeamData] = useState({
    name: "",
    email: "",
    visibility: "private", // Default visibility is private
  });
  const [message, setMessage] = useState(""); // To store success/error message
  const [createdTeam, setCreatedTeam] = useState(null); // To store created team

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to create a team
      const response = await axios.post(
        "http://localhost:3000/api/teams/create", 
        teamData
      );

      // Check if the team was created successfully
      if (response.data.success) {
        setMessage("Team created successfully!"); // Show success message
        setCreatedTeam(response.data.team); // Store created team details
        setShowForm(false); // Hide form after success
        setTeamData({
          name: "",
          email: "",
          visibility: "private", // Reset visibility
        });
      } else {
        setMessage(response.data.message); // Show error message
      }
    } catch (err) {
      setMessage("An error occurred while creating the team.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Create Team
      </button>

      {/* Show success message after team creation */}
      {createdTeam && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
          <p className="text-lg">
            Team '{createdTeam.name}' has been created successfully!
          </p>
        </div>
      )}

      {/* Display the team creation form */}
      {showForm && !createdTeam && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-center">Create Team</h2>
          
          {/* Display success or error messages */}
          {message && (
            <p
              className={`text-center mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Team Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={teamData.name}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={teamData.email}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                Visibility:
              </label>
              <select
                id="visibility"
                name="visibility"
                value={teamData.visibility}
                onChange={handleChange}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Create Team
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Teams;
