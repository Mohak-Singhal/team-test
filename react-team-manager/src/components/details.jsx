import React, { useState } from 'react';
import axios from 'axios';

const TeamDetails = () => {
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLeavePopup, setShowLeavePopup] = useState(false);

  // API URL
//   const url = 'http://localhost:3000'; 
   const url = 'https://team-test.onrender.com'; 


  // Handle input changes
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission and fetch team data from backend
  const handleSearch = async () => {
    if (!email) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send the request to the backend with email as query parameter
      const response = await axios.get(`${url}/api/teams/user-team`, { params: { email } });

      if (response.data.success) {
        setTeam(response.data.team); // Use the 'team' from response data
      } else {
        setError(response.data.message || 'No team found for this email');
      }
    } catch (err) {
      setError('Error fetching team details');
    } finally {
      setLoading(false);
    }
  };

  // Handle leaving the team
  const handleLeaveTeam = async () => {
    try {
      const response = await axios.post(`${url}/api/teams/leave`, { email });
      if (response.data.success) {
        setTeam(null); // Clear team data after leaving
        setError(''); // Clear any previous error
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error leaving the team');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-8 px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Find Your Team</h2>

        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
            Enter your email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="example@domain.com"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {loading ? 'Searching...' : 'Search Team'}
        </button>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {/* Team Details */}
        {team && (
          <div className="mt-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800">Team: {team.teamname}</h3>
              <p className="text-gray-600 mt-2">{team.description}</p>

              {/* Leader Info */}
              {team.leader && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                  <h4 className="text-xl font-semibold text-gray-800">Leader:</h4>
                  <p className="text-gray-700">{team.leader.username}</p>
                  <p className="text-gray-500 text-sm">{team.leader.email}</p>
                </div>
              )}

              {/* Members Info */}
              <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-800">Members:</h4>
                <ul className="list-disc list-inside pl-5 mt-2">
                  {team.members.map((member, index) => (
                    <li key={index} className="text-gray-700">{member}</li>
                  ))}
                </ul>
              </div>

              {/* Leave Team Button */}
              <button
                onClick={() => setShowLeavePopup(true)}
                className="mt-6 w-full p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Leave Team
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leave Confirmation Popup */}
      {showLeavePopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            {/* Close Button (Cross) */}
            <button
              onClick={() => setShowLeavePopup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to leave the team?</h3>
            <div className="flex justify-between">
              <button
                onClick={() => setShowLeavePopup(false)}
                className="w-1/2 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveTeam}
                className="w-1/2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes, Leave Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
