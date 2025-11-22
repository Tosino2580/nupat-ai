/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 22/11/2025 - 13:48:15
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/11/2025
    * - Author          : fortu
    * - Modification    : 
**/
import React, { useState } from "react";

// Reusable Input Component
const InputField = ({ type, placeholder, value, onChange, error }) => (
  <div className="flex flex-col gap-1">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 bg-black/40 border rounded-xl text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 backdrop-blur-sm
        ${error ? 'border-red-500/60 focus:ring-red-500/60' : 'border-blue-600/40 focus:ring-blue-500/60'}`}
      required
    />
    {error && <span className="text-sm text-red-400">{error}</span>}
  </div>
);

// Reusable Button
const PrimaryButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg text-white bg-gradient-to-r
      ${loading
        ? 'from-blue-800 to-blue-600 cursor-not-allowed opacity-70'
        : 'from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 hover:shadow-blue-500/30'}`}
  >
    {loading ? "Loading..." : children}
  </button>
);

const Login = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};
    if (!phoneOrEmail.trim()) temp.phoneOrEmail = "This field is required";
    if (!password.trim()) temp.password = "Password is required";
    return temp;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("userToken", "fakeToken123");
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="font-montserrat relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.blue.600)_0%,theme(colors.blue.900)_100%)] opacity-20"></div>

        <div className="animate-blob absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-700/40 blur-3xl"></div>
        <div className="animate-blob animation-delay-2000 absolute right-0 top-1/2 h-96 w-96 rounded-full bg-blue-500/40 blur-3xl"></div>
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-blue-400/40 blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-blue-700/40 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-4 text-center text-4xl font-bold text-blue-100">Welcome Back</h1>
        <p className="mb-8 text-center text-blue-300">Login to continue</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <InputField
            type="text"
            placeholder="Phone or Email"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            error={errors.phoneOrEmail}
          />

          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <PrimaryButton loading={loading}>Login</PrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default Login;
