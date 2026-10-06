import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "nearshop-token",
        response.data.token
      );

      localStorage.setItem(
        "nearshop-user",
        JSON.stringify(response.data.user)
      );

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-green-700">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your NearShop account
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-500 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;