import React from "react";
import Teams from "./components/teams";
import PublicTeams from "./components/publicteams";
import CreateUser from "./components/user";
import LeaderLogin from "./components/leader";


function App() {
  return (
    <div className="App">
      <h1>Welcome to the Team Management System</h1>
      <LeaderLogin/>
      <CreateUser/>
      <Teams />
      <PublicTeams/>
    </div>
  );
}

export default App;
