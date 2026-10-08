import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("nearshop-token");
  const userData = localStorage.getItem("nearshop-user");

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("nearshop-token");
    localStorage.removeItem("nearshop-user");

    setMenuOpen(false);

    alert("You have been logged out successfully.");

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-green-900 flex items-center justify-center font-extrabold text-xl">
              N
            </div>

            <div>
              <h1 className="font-extrabold text-xl">
                NearShop
              </h1>

              <p className="text-[10px] text-green-200">
                Your Local Grocery
              </p>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              to="/"
              className="hover:text-green-300 transition"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="hover:text-green-300 transition"
            >
              Products
            </Link>

            {token && (
              <Link
                to="/orders"
                className="hover:text-green-300 transition"
              >
                Orders
              </Link>
            )}

            {/* CART */}
            <Link
              to="/cart"
              className="relative hover:text-green-300 transition"
            >
              <ShoppingCart size={22} />

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER */}
            {token ? (
              <div className="flex items-center gap-3">

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
                    <User size={17} />
                  </div>

                  <span className="text-sm font-semibold">
                    {user?.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
                >
                  <LogOut size={17} />
                  Logout
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-green-900 px-5 py-2 rounded-lg font-bold hover:bg-green-100 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            {menuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden border-t border-green-800 py-4 space-y-3">

            <Link
              to="/"
              onClick={closeMenu}
              className="block py-2"
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={closeMenu}
              className="block py-2"
            >
              Products
            </Link>

            {token && (
              <Link
                to="/orders"
                onClick={closeMenu}
                className="block py-2"
              >
                Orders
              </Link>
            )}

            <Link
              to="/cart"
              onClick={closeMenu}
              className="flex items-center gap-2 py-2"
            >
              <ShoppingCart size={20} />
              Cart ({cartCount})
            </Link>

            {token ? (
              <div className="pt-3 border-t border-green-800">

                <div className="flex items-center gap-2 mb-3">
                  <User size={18} />

                  <span>
                    {user?.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-bold"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block text-center bg-white text-green-900 px-4 py-3 rounded-lg font-bold"
              >
                Login
              </Link>
            )}

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;