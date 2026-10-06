import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("nearshop-token");
  const savedUser = localStorage.getItem("nearshop-user");

  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("nearshop-token");
    localStorage.removeItem("nearshop-user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <nav className="bg-green-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold"
        >
          NearShop
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="hover:text-green-300"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-green-300"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="hover:text-green-300"
          >
            Cart
          </Link>

          {token && (
            <Link
              to="/orders"
              className="hover:text-green-300"
            >
              Orders
            </Link>
          )}

          {/* User */}
          {token && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <User size={18} />
                <span>{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              Login
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative"
          >
            <ShoppingCart size={24} />

            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;