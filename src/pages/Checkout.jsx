import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Home,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  Truck,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    deliveryCharge,
    total,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/products");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      toast.error("Please fill all delivery details");
      return;
    }

    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (formData.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    setPlacingOrder(true);

    const order = {
      orderId: `NS${Date.now()}`,
      address: formData,
      items: cartItems,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      orderDate: new Date().toISOString(),
      status: "Order Placed",
    };

    localStorage.setItem(
      "nearshop-last-order",
      JSON.stringify(order)
    );

    setTimeout(() => {
      clearCart();

      toast.success("Order placed successfully!");

      navigate("/orders");
    }, 800);
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f6f8f4]">
        <section className="bg-green-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Checkout
            </h1>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center">
              <CreditCard
                size={36}
                className="text-green-800"
              />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mt-6">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mt-2">
              Add some products before going to checkout.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-xl font-bold"
            >
              <ArrowLeft size={18} />
              Go Shopping
            </Link>

          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f4]">

      {/* =========================================
          HEADER
      ========================================== */}
      <section className="bg-green-950 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white text-sm font-semibold transition"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">
            Checkout
          </h1>

          <p className="text-green-100 mt-2">
            Complete your delivery and payment details
          </p>

        </div>

      </section>

      {/* =========================================
          CHECKOUT CONTENT
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        <form onSubmit={handlePlaceOrder}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* =====================================
                LEFT SIDE
            ====================================== */}
            <div className="lg:col-span-2 space-y-6">

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                    <MapPin
                      size={22}
                      className="text-green-800"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      Delivery Address
                    </h2>

                    <p className="text-sm text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name
                    </label>

                    <div className="relative">

                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
                      />

                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number
                    </label>

                    <div className="relative">

                      <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
                      />

                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      House / Street Address
                    </label>

                    <div className="relative">

                      <Home
                        size={18}
                        className="absolute left-3 top-4 text-gray-400"
                      />

                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House number, street, area..."
                        rows="3"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none resize-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
                      />

                    </div>

                  </div>

                  {/* City */}
                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
                    />

                  </div>

                  {/* Pincode */}
                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
                    />

                  </div>

                </div>

              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                    <CreditCard
                      size={22}
                      className="text-green-800"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      Payment Method
                    </h2>

                    <p className="text-sm text-gray-500">
                      Choose how you want to pay
                    </p>
                  </div>

                </div>

                <div className="space-y-3">

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-green-700 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                      className="w-4 h-4 accent-green-800"
                    />

                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Banknote
                        size={21}
                        className="text-green-800"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Pay when your order arrives
                      </p>
                    </div>

                  </label>

                  {/* UPI */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "upi"
                        ? "border-green-700 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                      className="w-4 h-4 accent-green-800"
                    />

                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Smartphone
                        size={21}
                        className="text-green-800"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        UPI
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Pay using your UPI app
                      </p>
                    </div>

                  </label>

                </div>

                {/* Payment Notice */}
                <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-100">

                  <div className="flex gap-3">

                    <ShieldCheck
                      size={19}
                      className="text-green-700 flex-shrink-0"
                    />

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Your order information is handled securely.
                      This demo checkout does not process real
                      payments.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================
                RIGHT SIDE - ORDER SUMMARY
            ====================================== */}
            <div className="lg:col-span-1">

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">

                <h2 className="text-xl font-extrabold text-gray-900">
                  Your Order
                </h2>

                {/* Products */}
                <div className="mt-5 space-y-4 max-h-72 overflow-y-auto pr-1">

                  {cartItems.map((item) => (

                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                    >

                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f1f7ed] flex-shrink-0">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            🛒
                          </div>
                        )}

                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">

                        <p className="font-bold text-sm text-gray-900 truncate">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          ₹{item.price} × {item.quantity}
                        </p>

                      </div>

                      <p className="font-bold text-sm text-gray-900">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>

                  ))}

                </div>

                <div className="border-t border-gray-100 my-5" />

                {/* Subtotal */}
                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{subtotal}
                  </span>

                </div>

                {/* Delivery */}
                <div className="flex justify-between text-sm mt-4">

                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span
                    className={
                      deliveryCharge === 0
                        ? "font-semibold text-green-700"
                        : "font-semibold text-gray-900"
                    }
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge}`}
                  </span>

                </div>

                <div className="border-t border-gray-100 my-5" />

                {/* Total */}
                <div className="flex items-center justify-between">

                  <span className="text-lg font-extrabold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-green-800">
                    ₹{total}
                  </span>

                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  disabled={placingOrder}
                  className={`w-full mt-6 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition ${
                    placingOrder
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-green-800 hover:bg-green-900 active:scale-[0.98]"
                  }`}
                >
                  {placingOrder ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={19} />
                      Place Order
                    </>
                  )}
                </button>

                {/* Delivery Info */}
                <div className="mt-5 flex gap-3 p-4 rounded-xl bg-green-50 border border-green-100">

                  <Truck
                    size={20}
                    className="text-green-700 flex-shrink-0"
                  />

                  <p className="text-xs text-green-800 leading-relaxed">
                    Local delivery is available. Free delivery
                    applies to orders above ₹500.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </form>

      </section>

    </main>
  );
}

export default Checkout;