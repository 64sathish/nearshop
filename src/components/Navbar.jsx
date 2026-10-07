import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  User,
  Menu,
  X,
  Home,
  Package,
  ClipboardList,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function Navbar() {
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const token = localStorage.getItem(
    "nearshop-token"
  );

  const savedUser = localStorage.getItem(
    "nearshop-user"
  );

  const user = savedUser
    ? JSON.parse(savedUser)
    : null;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("nearshop-token");
    localStorage.removeItem("nearshop-user");

    closeMobileMenu();

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-950 text-white shadow-lg">

      {/* ================= DESKTOP / MAIN NAV ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 group"
          >

            <div className="w-10 h-10 bg-green-700 group-hover:bg-green-600 rounded-xl flex items-center justify-center text-xl transition">
              🛒
            </div>

            <div>
              <span className="text-xl sm:text-2xl font-extrabold">
                NearShop
              </span>

              <p className="hidden sm:block text-[10px] text-green-300 -mt-1">
                Fresh • Local • Simple
              </p>
            </div>

          </Link>

          {/* DESKTOP LINKS */}

          <div className="hidden md:flex items-center gap-1">

            <Link
              to="/"
              className="px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium"
            >
              Products
            </Link>

            {token && (
              <Link
                to="/orders"
                className="px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium"
              >
                Orders
              </Link>
            )}

          </div>

          {/* DESKTOP RIGHT */}

          <div className="hidden md:flex items-center gap-3">

            {/* USER */}

            {token && user ? (

              <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 bg-green-900 px-3 py-2 rounded-lg">

                  <User size={17} />

                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>

                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg font-medium transition"
                >
                  <LogOut size={17} />

                  <span>
                    Logout
                  </span>
                </button>

              </div>

            ) : (

              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold transition"
              >
                Login
              </Link>

            )}

            {/* CART */}

            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-lg hover:bg-green-800 flex items-center justify-center transition"
            >

              <ShoppingCart size={23} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-green-950">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}

            </Link>

          </div>

          {/* MOBILE BUTTONS */}

          <div className="flex md:hidden items-center gap-2">

            {/* MOBILE CART */}

            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-green-800"
            >

              <ShoppingCart size={22} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-green-950">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}

            </Link>

            {/* MENU BUTTON */}

            <button
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-green-800 transition"
              aria-label="Toggle menu"
            >

              {mobileMenuOpen ? (
                <X size={25} />
              ) : (
                <Menu size={25} />
              )}

            </button>

          </div>

        </div>

      </div>

      {/* ================= MOBILE MENU ================= */}

      {mobileMenuOpen && (

        <div className="md:hidden border-t border-green-800 bg-green-950">

          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">

            {/* HOME */}

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-800 transition"
            >

              <Home size={19} />

              <span className="font-medium">
                Home
              </span>

            </Link>

            {/* PRODUCTS */}

            <Link
              to="/products"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-800 transition"
            >

              <Package size={19} />

              <span className="font-medium">
                Products
              </span>

            </Link>

            {/* CART */}

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-800 transition"
            >

              <div className="flex items-center gap-3">

                <ShoppingCart size={19} />

                <span className="font-medium">
                  Cart
                </span>

              </div>

              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}

            </Link>

            {/* ORDERS */}

            {token && (
              <Link
                to="/orders"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-800 transition"
              >

                <ClipboardList size={19} />

                <span className="font-medium">
                  My Orders
                </span>

              </Link>
            )}

            {/* USER */}

            <div className="border-t border-green-800 pt-3 mt-3">

              {token && user ? (

                <>

                  <div className="flex items-center gap-3 px-4 py-3">

                    <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                      <User size={19} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs text-green-300">
                        Logged in as
                      </p>

                      <p className="font-bold truncate">
                        {user.name}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-bold transition"
                  >

                    <LogOut size={18} />

                    Logout

                  </button>

                </>

              ) : (

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-3 rounded-xl font-bold transition"
                >
                  <User size={18} />
                  Login
                </Link>

              )}

            </div>

          </div>

        </div>

      )}

    </nav>
  );
}

export default Navbar;