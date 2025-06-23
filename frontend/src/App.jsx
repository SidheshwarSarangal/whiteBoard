import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";

const App = () => (
  <Router>
    {/* 🔥 Toast rendered outside Routes */}
    <Toaster position="top-right" reverseOrder={false} />

    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/room/:roomId"
        element={
          <PrivateRoute>
            <Room />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<SignIn />} />
    </Routes>
  </Router>
);

export default App;
