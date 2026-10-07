import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CalendarDays,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";

function Orders() {
  const savedOrder = localStorage.getItem("nearshop-last-order");

  const order = savedOrder
    ? JSON.parse(savedOrder)
    : null;

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f6f8f4]">

        {/* Header */}
        <section className="bg-green-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

            <h1 className="text-3xl sm:text-4xl font-extrabold">
              My Orders
            </h1>

            <p className="text-green-100 mt-2">
              Track and manage your NearShop orders
            </p>

          </div>
        </section>

        {/* Empty Orders */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-14 text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center">

              <Package
                size={42}
                className="text-green-800"
              />

            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-6">
              No Orders Yet
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mt-3">
              You haven't placed any orders yet.
              Start shopping and your orders will appear here.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-7 bg-green-800 hover:bg-green-900 text-white px-7 py-3.5 rounded-xl font-bold transition"
            >
              <ArrowLeft size={18} />
              Start Shopping
            </Link>

          </div>

        </section>

      </main>
    );
  }

  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const paymentText =
    order.paymentMethod === "upi"
      ? "UPI"
      : "Cash on Delivery";

  return (
    <main className="min-h-screen bg-[#f6f8f4]">

      {/* =========================================
          HEADER
      ========================================== */}
      <section className="bg-green-950 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          <h1 className="text-3xl sm:text-4xl font-extrabold">
            My Orders
          </h1>

          <p className="text-green-100 mt-2">
            Track and manage your NearShop orders
          </p>

        </div>

      </section>

      {/* =========================================
          CONTENT
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Order Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">

                  <Package
                    size={22}
                    className="text-green-800"
                  />

                </div>

                <div>

                  <p className="text-xs text-gray-500">
                    Order ID
                  </p>

                  <h2 className="font-extrabold text-gray-900">
                    {order.orderId}
                  </h2>

                </div>

              </div>

            </div>

            {/* Status */}
            <div className="flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full w-fit">

              <CheckCircle size={17} />

              <span className="text-sm font-bold">
                {order.status || "Order Placed"}
              </span>

            </div>

          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">

            <div className="flex items-center gap-3">

              <CalendarDays
                size={19}
                className="text-green-700"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Order Date
                </p>

                <p className="text-sm font-bold text-gray-900">
                  {orderDate}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <CreditCard
                size={19}
                className="text-green-700"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Payment
                </p>

                <p className="text-sm font-bold text-gray-900">
                  {paymentText}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <Truck
                size={19}
                className="text-green-700"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Delivery
                </p>

                <p className="text-sm font-bold text-green-700">
                  Local Delivery
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">

          {/* =====================================
              PRODUCTS
          ====================================== */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

              <h2 className="text-xl font-extrabold text-gray-900">
                Ordered Products
              </h2>

              <div className="mt-5 space-y-4">

                {order.items?.map((item, index) => (

                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >

                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#f1f7ed] flex-shrink-0">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🛒
                        </div>
                      )}

                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">

                      <h3 className="font-bold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.unit}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        📍 {item.shop}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">

                        <p className="text-sm text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>

                        <p className="font-extrabold text-green-800">
                          ₹{item.price * item.quantity}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* =====================================
              RIGHT SIDE
          ====================================== */}
          <div className="lg:col-span-1 space-y-6">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

              <h2 className="text-xl font-extrabold text-gray-900">
                Order Summary
              </h2>

              <div className="flex justify-between mt-6 text-sm">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold text-gray-900">
                  ₹{order.subtotal}
                </span>

              </div>

              <div className="flex justify-between mt-4 text-sm">

                <span className="text-gray-500">
                  Delivery
                </span>

                <span
                  className={
                    order.deliveryCharge === 0
                      ? "font-semibold text-green-700"
                      : "font-semibold text-gray-900"
                  }
                >
                  {order.deliveryCharge === 0
                    ? "FREE"
                    : `₹${order.deliveryCharge}`}
                </span>

              </div>

              <div className="border-t border-gray-100 my-5" />

              <div className="flex items-center justify-between">

                <span className="text-lg font-extrabold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-extrabold text-green-800">
                  ₹{order.total}
                </span>

              </div>

              <Link
                to="/order-tracking"
                className="w-full mt-6 bg-green-800 hover:bg-green-900 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition"
              >
                <Truck size={18} />
                Track Order
              </Link>

            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">

                  <MapPin
                    size={20}
                    className="text-green-800"
                  />

                </div>

                <h2 className="font-extrabold text-gray-900">
                  Delivery Address
                </h2>

              </div>

              <div className="mt-4 text-sm text-gray-600 leading-relaxed">

                <p className="font-bold text-gray-900">
                  {order.address?.name}
                </p>

                <p className="mt-1">
                  {order.address?.address}
                </p>

                <p>
                  {order.address?.city} -{" "}
                  {order.address?.pincode}
                </p>

                <p className="mt-2">
                  📞 {order.address?.phone}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-green-800 font-bold hover:text-green-950 transition"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Orders;