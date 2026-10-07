import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    deliveryCharge,
    total,
  } = useCart();

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f6f8f4]">

        {/* Header */}
        <section className="bg-green-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-green-100 hover:text-white text-sm font-semibold transition"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>

            <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">
              Shopping Cart
            </h1>
          </div>
        </section>

        {/* Empty State */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-14 text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center">
              <ShoppingCart
                size={42}
                className="text-green-800"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-6">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mt-3 leading-relaxed">
              You haven't added any grocery products yet.
              Browse our fresh products and add your favorites
              to your shopping cart.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 mt-7 bg-green-800 hover:bg-green-900 text-white px-7 py-3.5 rounded-xl font-bold transition active:scale-[0.98]"
            >
              Start Shopping
              <ArrowRight size={18} />
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
            to="/products"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white text-sm font-semibold transition"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">
            Shopping Cart
          </h1>

          <p className="text-green-100 mt-2">
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "product" : "products"} in your cart
          </p>

        </div>

      </section>

      {/* =========================================
          CART CONTENT
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* =====================================
              LEFT SIDE - PRODUCTS
          ====================================== */}
          <div className="lg:col-span-2 space-y-4">

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition"
              >

                <div className="flex gap-4">

                  {/* Product Image */}
                  <Link
                    to={`/products/${item.id}`}
                    className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[#f1f7ed]"
                  >

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🛒
                      </div>
                    )}

                  </Link>

                  {/* Product Information */}
                  <div className="flex-1 min-w-0">

                    {/* Name + Remove */}
                    <div className="flex justify-between gap-3">

                      <div className="min-w-0">

                        <Link
                          to={`/products/${item.id}`}
                          className="font-extrabold text-gray-900 text-base sm:text-lg hover:text-green-800 transition line-clamp-2"
                        >
                          {item.name}
                        </Link>

                        <p className="text-sm text-gray-500 mt-1">
                          {item.unit}
                        </p>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                          📍 {item.shop}
                        </p>

                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove product"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-3">

                      <span className="text-lg sm:text-xl font-extrabold text-green-800">
                        ₹{item.price}
                      </span>

                      {item.oldPrice &&
                        item.oldPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{item.oldPrice}
                          </span>
                        )}

                    </div>

                    {/* Quantity + Item Total */}
                    <div className="flex items-center justify-between gap-3 mt-4">

                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 hover:bg-green-50 transition"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-10 sm:w-12 text-center font-bold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 hover:bg-green-50 transition"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      {/* Item Total */}
                      <div className="text-right">

                        <p className="text-xs text-gray-500">
                          Item Total
                        </p>

                        <p className="text-lg font-extrabold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl border border-green-100 p-5">

              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">

                  <Truck
                    size={22}
                    className="text-green-800"
                  />

                </div>

                <div>

                  <h3 className="font-bold text-gray-900">
                    Local Delivery
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Free delivery on orders above ₹500.
                    Orders below ₹500 have a ₹40 delivery charge.
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
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex items-center justify-between mt-6">

                <span className="text-sm text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold text-gray-900">
                  ₹{subtotal}
                </span>

              </div>

              {/* Delivery */}
              <div className="flex items-center justify-between mt-4">

                <span className="text-sm text-gray-500">
                  Delivery
                </span>

                <span
                  className={`font-semibold ${
                    deliveryCharge === 0
                      ? "text-green-700"
                      : "text-gray-900"
                  }`}
                >
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge}`}
                </span>

              </div>

              {/* Free Delivery Message */}
              {subtotal > 0 && subtotal < 500 && (
                <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-3">

                  <p className="text-xs text-green-800 font-semibold leading-relaxed">
                    Add ₹{500 - subtotal} more to get FREE delivery.
                  </p>

                </div>
              )}

              {/* Divider */}
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

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="mt-6 w-full bg-green-800 hover:bg-green-900 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition active:scale-[0.98]"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-500">

                <ShieldCheck
                  size={16}
                  className="text-green-700"
                />

                Secure checkout

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Cart;