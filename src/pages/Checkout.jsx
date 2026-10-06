import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    const order = {
      orderId: "NS" + Date.now(),
      customer: address,
      items: cartItems,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      orderDate: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "nearshop-last-order",
      JSON.stringify(order)
    );

    clearCart();

    alert("Order placed successfully!");

    navigate("/orders");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mt-2 mb-6">
            Add products before checkout.
          </p>

          <Link
            to="/products"
            className="bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Delivery Details */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Delivery Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                />

                <textarea
                  name="address"
                  placeholder="House / Street / Area"
                  value={address.address}
                  onChange={handleChange}
                  rows="3"
                  className="md:col-span-2 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                />

              </div>

              {/* Payment */}
              <h2 className="text-xl font-bold text-gray-800 mt-8 mb-5">
                Payment Method
              </h2>

              <div className="space-y-3">

                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      UPI
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay using your UPI app
                    </p>
                  </div>
                </label>

              </div>

            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 h-fit">

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}

              </div>

              <div className="border-t pt-4 space-y-3">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge}`}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>

                  <span className="text-green-700">
                    ₹{total}
                  </span>
                </div>

              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-green-800"
              >
                Place Order
              </button>

            </div>

          </div>

        </form>
      </div>
    </div>
  );
}

export default Checkout;