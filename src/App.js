import React, { useContext } from "react";
import "./assets/css/App.css";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import { AuthContext } from "./services/AuthContext";

function App() {
  const { user, loading } = useContext(AuthContext);


  if (loading) {
    return <Loading />;
  }

  return <div className="App">{user ? <Home /> : <Welcome />}</div>;
}

export default App;
