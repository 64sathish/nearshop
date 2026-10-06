import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <ShoppingBag
            size={70}
            className="mx-auto mb-5 text-gray-400"
          />

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mb-8">
            Add some fresh groceries from nearby shops.
          </p>

          <Link
            to="/products"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-5"
              >

                {/* Product Image */}
                <div className="w-24 h-24 bg-green-50 rounded-xl overflow-hidden">
  <img
    src={item.image}
    alt={item.name}
    className="w-full h-full object-cover"
  />
</div>

                {/* Product Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.category}
                  </p>

                  <p className="text-sm text-gray-500">
                    Shop: {item.shop}
                  </p>

                  <p className="text-green-700 font-bold mt-2">
                    ₹{item.price}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center border rounded-lg">

                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="px-4 font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>

                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 mt-2 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))}

            <Link
              to="/products"
              className="inline-block text-green-700 font-semibold hover:underline"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between mb-4 text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-4 text-gray-600">
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-700">
                ₹{total}
              </span>
            </div>

            <Link
              to="/checkout"
              className="block text-center bg-green-700 text-white py-3 rounded-lg mt-6 hover:bg-green-800"
            >
              Proceed to Checkout
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;