import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/users";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedEmail =
    localStorage.getItem("nearshop-login-email") || "";

  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberEmail, setRememberEmail] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      toast.error("Please enter a valid email.");
      return false;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const cleanEmail =
        email.trim().toLowerCase();

      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: cleanEmail,
          password,
        }
      );

      console.log(
        "Login response:",
        response.data
      );

      if (
        rememberEmail
      ) {
        localStorage.setItem(
          "nearshop-login-email",
          cleanEmail
        );
      } else {
        localStorage.removeItem(
          "nearshop-login-email"
        );
      }

      if (
        response.data?.requiresOTP
      ) {
        localStorage.setItem(
          "nearshop-otp-email",
          cleanEmail
        );

        if (
          response.data?.developmentOTP
        ) {
          localStorage.setItem(
            "nearshop-development-otp",
            response.data.developmentOTP
          );
        }

        toast.success(
          "OTP generated. Please verify your OTP."
        );

        navigate("/verify-otp", {
          state: {
            email: cleanEmail,
            developmentOTP:
              response.data
                ?.developmentOTP,
          },
        });

        return;
      }

      if (response.data?.token) {
        localStorage.setItem(
          "nearshop-token",
          response.data.token
        );

        if (response.data?.user) {
          localStorage.setItem(
            "nearshop-user",
            JSON.stringify(
              response.data.user
            )
          );
        }

        toast.success(
          "Login successful."
        );

        const redirectPath =
          location.state?.from ||
          "/";

        navigate(redirectPath);
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Server message:",
        error.response?.data?.message
      );

      console.error(
        "Server data:",
        error.response?.data
      );

      let message =
        "Login failed. Please try again.";

      if (
        error.response?.data?.message
      ) {
        message =
          error.response.data.message;
      } else if (
        error.code ===
        "ERR_NETWORK"
      ) {
        message =
          "Cannot connect to server. Please start the backend.";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f4] px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <LogIn size={30} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to your NearShop account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) =>
                  setRememberEmail(
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-green-700"
              />

              Remember my email
            </label>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-700 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Checking..."
                : "Login"}
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-700 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;