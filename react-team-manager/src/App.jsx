import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [operation, setOperation] = useState("createUser");
  const [message, setMessage] = useState("");
  const url = 'http://localhost:3000'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear message
    try {
      let res;
      switch (operation) {
        case "createUser":
          res = await axios.post(url + "/api/users/create", { email, name });
          break;
        case "createTeam":
          res = await axios.post(url + "/api/teams/create", { teamName, email });
          break;
        case "joinTeam":
          res = await axios.post(url + "/api/teams/join", { teamName, email });
          break;
        case "leaveTeam":
          res = await axios.post(url + "/api/teams/leave", { email });
          break;
        default:
          throw new Error("Invalid operation");
      }
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.header}>Team Manager</h1>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <label style={styles.label}>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </label>
          <br />
          
          {/* Name Input for User Creation */}
          {operation === "createUser" && (
            <label style={styles.label}>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          )}
          <br />

          {/* Team Name Input for Team Operations */}
          {(operation === "createTeam" || operation === "joinTeam" || operation === "leaveTeam") && (
            <label style={styles.label}>
              Team Name:
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          )}
          <br />

          {/* Operation Selector */}
          <label style={styles.label}>
            Operation:
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              style={styles.select}
            >
              <option value="createUser">Create User</option>
              <option value="createTeam">Create Team</option>
              <option value="joinTeam">Join Team</option>
              <option value="leaveTeam">Leave Team</option>
            </select>
          </label>
          <br />

          {/* Submit Button */}
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>

        {/* Message Display */}
        {message && <div style={styles.message}>{message}</div>}
      </div>
    </div>
  );
};
// Inline styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
    width: "100%", // Ensure the container takes up the full width
    padding: "0 20px", // To prevent it from touching the sides on small screens
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%", // Make sure it takes up the available width
    maxWidth: "500px", // Increase max-width for larger forms
    boxSizing: "border-box", // Ensure padding is included in the width calculation
  },
  header: {
    textAlign: "center",
    color: "#333",
    fontSize: "24px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "16px",
    color: "#333",
  },
  input: {
    padding: "10px",
    width: "100%",
    marginTop: "5px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box", // Ensure padding doesn't affect the width
  },
  select: {
    padding: "10px",
    width: "100%",
    marginTop: "5px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box", // Ensure padding doesn't affect the width
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    color: "blue",
  },
};


export default App;
