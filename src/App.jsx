import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import ProtectedRoute from "./components/ProtectedRoute";
import ShopDashboard from "./pages/ShopDashboard";

function App() {
  return (
    <>
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

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>

<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>

<Route
  path="/order-tracking"
  element={
    <ProtectedRoute>
      <OrderTracking />
    </ProtectedRoute>
  }
/>
<Route
  path="/shop-dashboard"
  element={
    <ProtectedRoute>
      <ShopDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/shop-dashboard"
  element={
    <ProtectedRoute>
      <ShopDashboard />
    </ProtectedRoute>
  }
/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;