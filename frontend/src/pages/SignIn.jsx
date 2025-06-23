import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      const { token, user } = res.data;

      // Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");
      console.log("Login successful:", user);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md text-center text-white">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Welcome</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 pr-20"
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-100 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-red-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
