// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Profile from "./pages/Profile";

const App = () => (
  <Router>
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />}/>
      <Route path="/home" element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
      <Route path="*" element={<SignIn />} />
    </Routes>
  </Router>
);

export default App;
