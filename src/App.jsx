import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OTPVerification from "./pages/OTPVerification";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import ShopDashboard from "./pages/ShopDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1b3022",
            color: "#ffffff",
            borderRadius: "12px",
          },
        }}
      />

      <Navbar />

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* OTP Verification */}
        <Route
          path="/verify-otp"
          element={<OTPVerification />}
        />

        <Route path="/cart" element={<Cart />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route
  path="/verify-otp"
  element={<OTPVerification />}
/>

<Route path="/profile" element={<Profile />} />

<Route path="/checkout" element={<Checkout />} />
<Route path="/orders" element={<Orders />} />
<Route
  path="/wishlist"
  element={<Wishlist />}
/>

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* Order Tracking */}
        <Route
          path="/order-tracking"
          element={<OrderTracking />}
        />

        {/* Shop */}
        <Route
          path="/shop-dashboard"
          element={<ShopDashboard />}
        />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;