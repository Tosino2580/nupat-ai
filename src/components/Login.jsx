import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/nupatAPI";

const Login = ({ setShowRegister }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });

      // Adjust this if your backend uses a different key
      const token = res.access_token || res.token;
      if (!token) {
        setError("Invalid login details.");
        setLoading(false);
        return;
      }

      // Save token in localStorage for MainPage usage
      localStorage.setItem("token", token);

      // Optional: save user info if needed
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      // Redirect to MainPage route
      navigate("/home-page");

    } catch (err) {
      console.error(err);

      if (err.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (Array.isArray(parsed)) {
            setError(parsed.map(e => e.msg).join(" | "));
          } else {
            setError(err.message);
          }
        } catch {
          setError(err.message || "Something went wrong.");
        }
      } else {
        setError("Something went wrong.");
      }
    }

    setLoading(false);
  };

  return (
 <div className="main-page-bg min-h-screen relative flex items-center justify-center font-montserrat overflow-hidden">

  {/* Background */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

    {/* Blue Glow Blobs (matching MainPage) */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-700/40 rounded-full blur-3xl animate-blob"></div>
    <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/40 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
  </div>

  {/* Login Form */}
  <div className="relative z-10 w-full max-w-md">
    <form
      onSubmit={handleLogin}
      className="flex flex-col justify-center p-8 bg-black/30 backdrop-blur-md rounded-2xl border border-gray-800"
    >
      <div className="text-center mb-8">
        {/* Top Tag — BLUE Theme */}
        <div className="inline-flex items-center gap-2 bg-blue-600/10 px-4 py-2 rounded-full border border-blue-600/20 mb-6">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">Welcome Back</span>
        </div>

        <h1 className="text-4xl font-bold text-white">Sign In</h1>
        <p className="text-gray-400 mt-2">Enter your account to continue.</p>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-xl mb-4 text-center">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-blue-500 focus:outline-none"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input
            type="password"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {/* BUTTON — Blue Gradient */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* Redirect Link */}
      <div className="text-center text-gray-400 mt-6 text-sm">
        Don't have an account?
        <button
          type="button"
          onClick={() => setShowRegister(true)}
          className="text-blue-400 ml-1 hover:underline"
        >
          Create Account
        </button>
      </div>
    </form>
  </div>

</div>

  );
};

export default Login;
