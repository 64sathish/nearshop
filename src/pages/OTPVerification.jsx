import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/users";

function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    localStorage.getItem("nearshop-otp-email") ||
    "";

  const developmentOTP =
    location.state?.developmentOTP ||
    localStorage.getItem(
      "nearshop-development-otp"
    ) ||
    "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [resending, setResending] =
    useState(false);

  const [seconds, setSeconds] =
    useState(30);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!email) {
      toast.error(
        "Login session not found. Please login again."
      );

      navigate("/login");
      return;
    }

    inputRef.current?.focus();
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // Browser Web OTP support
  useEffect(() => {
    if (
      !("OTPCredential" in window) ||
      !navigator.credentials
    ) {
      return;
    }

    let cancelled = false;

    const getOTP = async () => {
      try {
        const controller =
          new AbortController();

        const credential =
          await navigator.credentials.get({
            otp: {
              transport: ["sms"],
            },
            signal:
              controller.signal,
          });

        if (
          !cancelled &&
          credential?.code
        ) {
          setOtp(credential.code);
        }
      } catch (error) {
        console.log(
          "Web OTP unavailable:",
          error.message
        );
      }
    };

    getOTP();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
  };

  const handleVerify = async (e) => {
    e?.preventDefault();

    if (!email) {
      toast.error(
        "Email not found. Please login again."
      );

      navigate("/login");
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      toast.error(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await axios.post(
          `${API_URL}/verify-otp`,
          {
            email,
            otp,
          }
        );

      console.log(
        "OTP verification response:",
        response.data
      );

      if (
        response.data?.success &&
        response.data?.token
      ) {
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

        localStorage.setItem(
          "nearshop-login-email",
          email
        );

        localStorage.removeItem(
          "nearshop-otp-email"
        );

        localStorage.removeItem(
          "nearshop-development-otp"
        );

        toast.success(
          "OTP verified. Login successful!"
        );

        navigate("/");
      } else {
        toast.error(
          response.data?.message ||
            "OTP verification failed."
        );
      }
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "OTP verification failed.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) {
      return;
    }

    if (!email) {
      toast.error(
        "Email not found. Please login again."
      );

      navigate("/login");
      return;
    }

    setResending(true);

    try {
      const response =
        await axios.post(
          `${API_URL}/resend-otp`,
          {
            email,
          }
        );

      console.log(
        "Resend OTP response:",
        response.data
      );

      const newOTP =
        response.data?.developmentOTP;

      if (newOTP) {
        localStorage.setItem(
          "nearshop-development-otp",
          newOTP
        );
      }

      toast.success(
        response.data?.message ||
          "New OTP generated."
      );

      setOtp("");
      setSeconds(30);

      inputRef.current?.focus();
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to resend OTP.";

      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    localStorage.removeItem(
      "nearshop-otp-email"
    );

    localStorage.removeItem(
      "nearshop-development-otp"
    );

    navigate("/login");
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f8f4] px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <ShieldCheck size={32} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Verify OTP
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enter the 6-digit OTP generated for
            </p>

            <p className="mt-1 break-all font-semibold text-green-700">
              {email}
            </p>
          </div>

          {/* Development OTP */}
          {developmentOTP && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <p className="text-xs font-medium text-green-700">
                Development OTP
              </p>

              <p className="mt-1 text-2xl font-bold tracking-[0.3em] text-green-800">
                {developmentOTP}
              </p>

              <p className="mt-1 text-xs text-green-700">
                Check your backend terminal also.
              </p>
            </div>
          )}

          <form
            onSubmit={handleVerify}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                6-Digit OTP
              </label>

              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className="w-full rounded-xl border border-gray-300 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="w-full rounded-xl bg-green-700 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP & Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            {seconds > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in{" "}
                <span className="font-semibold text-green-700">
                  {seconds}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-2 font-semibold text-green-700 hover:underline disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    resending
                      ? "animate-spin"
                      : ""
                  }
                />

                {resending
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="mx-auto mt-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700"
          >
            <ArrowLeft size={17} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;