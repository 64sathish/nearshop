import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  ShoppingBag,
  Heart,
  MapPin,
  Gift,
  LogOut,
  Pencil,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("nearshop-user");

    if (!savedUser) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("User data error:", error);

      localStorage.removeItem("nearshop-user");
      localStorage.removeItem("nearshop-token");

      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("nearshop-token");
    localStorage.removeItem("nearshop-user");
    localStorage.removeItem("nearshop-otp-email");
    localStorage.removeItem(
      "nearshop-development-otp"
    );

    toast.success("Logged out successfully.");

    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f4] px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your NearShop account
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm">

          <div className="bg-green-800 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-green-800 shadow-lg">
                <User size={45} />
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">
                  {user.name}
                </h2>

                <p className="mt-1 text-green-100">
                  {user.role === "customer"
                    ? "Customer"
                    : user.role}
                </p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">

            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <Mail
                  size={20}
                  className="text-green-700"
                />

                <span className="text-sm font-semibold text-gray-500">
                  Email Address
                </span>
              </div>

              <p className="break-all font-medium text-gray-900">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <Phone
                  size={20}
                  className="text-green-700"
                />

                <span className="text-sm font-semibold text-gray-500">
                  Mobile Number
                </span>
              </div>

              <p className="font-medium text-gray-900">
                {user.phone || "Not available"}
              </p>
            </div>

          </div>
        </div>

        {/* Account Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            My Account
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Orders */}
            <Link
              to="/orders"
              className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ShoppingBag size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                My Orders
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View and track your orders
              </p>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Heart size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                Wishlist
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View products you liked
              </p>
            </Link>

            {/* Addresses */}
            <Link
              to="/addresses"
              className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <MapPin size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                My Addresses
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage delivery addresses
              </p>
            </Link>

            {/* Offers */}
            <Link
              to="/offers"
              className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                <Gift size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                Offers & Discounts
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View your available offers
              </p>
            </Link>

            {/* Edit */}
            <button
              type="button"
              onClick={() =>
                toast("Profile editing will be added next.")
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Pencil size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                Edit Profile
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Update your account information
              </p>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <LogOut size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                Logout
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Sign out of your NearShop account
              </p>
            </button>

          </div>
        </div>

        {/* Customer Benefits */}
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            NearShop Customer Benefits
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-2xl font-bold text-green-700">
                5%
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Discount from ₹1,000 purchase
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-2xl font-bold text-green-700">
                10%
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Discount from ₹5,000 purchase
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-2xl font-bold text-green-700">
                20%
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Maximum discount at ₹1,00,000+
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;