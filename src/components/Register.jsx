import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { signup } from "../api/nupatAPI";

const Register = ({ setShowRegister }) => { // <-- receive setShowRegister
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await signup({ email, phone: phone || undefined, password });

      if (!res.access_token) {
        setError("Registration failed. Check your inputs.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.access_token);

      // After registration, switch to login
      setShowRegister(false);

    } catch (err) {
      console.error(err);
      if (err.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (Array.isArray(parsed)) {
            setError(parsed.map((e) => e.msg).join(" | "));
          } else {
            setError(err.message);
          }
        } catch {
          setError(err.message || "Something went wrong. Try again.");
        }
      } else {
        setError("Something went wrong. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="main-page-bg min-h-screen relative flex items-center justify-center font-montserrat overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/50 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-900/50 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-900/50 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Register Form */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleRegister}
          className="flex flex-col justify-center p-8 bg-black/30 backdrop-blur-md rounded-2xl border border-gray-800"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Create Your Account</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Get Started</h1>
            <p className="text-gray-400 mt-2">Join us and start building with AI.</p>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone (Optional)</label>
              <input
                type="tel"
                placeholder="+234 801 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?
            <button
              type="button"
              onClick={() => setShowRegister(false)} // <-- switch back to login
              className="text-purple-400 ml-1 hover:underline"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
