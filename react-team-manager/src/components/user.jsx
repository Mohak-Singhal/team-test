import { useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  const [message, setMessage] = useState(""); // To store success/error message
  const [createdUser, setCreatedUser] = useState(null); // To store created user
  const url ='https://team-test.onrender.com'
//   const url = "http://localhost:3000";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to create a user
      const response = await axios.post(
        url + "/api/users/create",
        userData
      );

      // Check if the user was created successfully
      if (response.data.user) {
        setMessage("User created successfully!"); // Show success message
        setCreatedUser(response.data.user); // Store created user details
        setShowForm(false); // Hide form after success
        setUserData({
          username: "",
          email: "",
        });
      } else {
        setMessage(response.data.message); // Show error message
      }
    } catch (err) {
      setMessage("An error occurred while creating the user.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Create User
      </button>

      {/* Show success message after user creation */}
      {createdUser && (
        <div className="mt-6 p-4 bg-green-200 text-green-800 rounded-lg shadow-md">
          <p>User '{createdUser.username}' has been created successfully!</p>
        </div>
      )}

      {showForm && !createdUser && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-center mb-6">Create User</h2>

          {/* Display success or error messages */}
          {message && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                message.includes("success")
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-lg font-semibold text-gray-700"
              >
                User Name
              </label>
              <input
                type="text"
                id="username"
                name="username" // Corrected from "name" to "username"
                value={userData.username}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Create User
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
