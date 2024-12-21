import { useEffect, useState } from "react";
import axios from "axios";

const PublicTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinError, setJoinError] = useState(""); // To store any error while joining a team
  const [joinMessage, setJoinMessage] = useState(""); // To store success or failure messages for joining
  const [email, setEmail] = useState(""); // State to store the email input
  const [teamNameToJoin, setTeamNameToJoin] = useState(""); // To store the team name for joining
  const [isModalOpen, setIsModalOpen] = useState(false); // To handle modal visibility
  const url = "https://team-test.onrender.com";
// const url = 'http://localhost:3000';
  // Fetch public teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(url + "/api/teams/list");
        if (response.data.success) {
          // Filter out only public teams
          const publicTeams = response.data.teams.filter(
            (team) => team.visibility === "public"
          );
          setTeams(publicTeams);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("An error occurred while fetching teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Handle joining a team
  const handleJoinTeam = async () => {
    if (!email) {
      setJoinError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(url + "/api/teams/request-join", {
        teamName: teamNameToJoin, // Team name to join
        email: email, // User's email
      });

      if (response.data.success) {
        setJoinMessage("Join request sent successfully!"); // Display success message
        setJoinError(""); // Reset any previous errors
      } else {
        setJoinMessage(""); // Reset success message
        setJoinError(response.data.message); // Display error message from the backend
      }
    } catch (err) {
      setJoinError("An error occurred while sending join request.");
      setJoinMessage(""); // Reset success message if error occurs
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Public Teams</h2>

      {/* Show loading message */}
      {loading && <p className="text-center text-lg text-gray-500">Loading teams...</p>}

      {/* Show error message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display teams if available */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length === 0 ? (
          <p className="col-span-full text-center text-lg text-gray-500">No public teams available.</p>
        ) : (
          teams.map((team) => (
            <div
              key={team._id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-blue-600">{team.name}</h3>
              <p className="mt-2 text-gray-600">Leader: {team.leader.name}</p>
              <p className="mt-2 text-gray-600">Description: {team.description}</p>
              <p className="text-gray-600">Visibility: {team.visibility}</p>

              {/* Show button to join if user is not in the team already */}
              <button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                onClick={() => {
                  setTeamNameToJoin(team.name); // Set team name when clicked
                  setIsModalOpen(true); // Open modal to join
                }}
              >
                Join Team
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal to enter email for joining team */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)} // Close the modal when "X" is clicked
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-center mb-4">Join {teamNameToJoin}</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                onClick={handleJoinTeam}
              >
                Submit Request
              </button>
            </div>

            {/* Show success or error message below the button */}
            {joinMessage && (
              <p className="mt-4 text-green-500 text-center">{joinMessage}</p>
            )}
            {joinError && (
              <p className="mt-4 text-red-500 text-center">{joinError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicTeams;
