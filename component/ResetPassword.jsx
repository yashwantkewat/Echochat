import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const validate = () => {
    if (!/^\d{4}$/.test(otp)) {
      setError("OTP must be a 4-digit number.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5002/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.msg || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Error: Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Reset Password</h2>

        <div>
          <label htmlFor="otp" className="block mb-1 font-medium">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="4-digit OTP"
            className="form-control w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="form-control w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {loading && <p className="text-gray-500">Loading...</p>}

        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
