import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Store,
  ChefHat,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";

function OrderTracking() {
  const savedOrder = localStorage.getItem("nearshop-last-order");

  const order = savedOrder
    ? JSON.parse(savedOrder)
    : null;

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f6f8f4]">

        <section className="bg-green-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Track Order
            </h1>

            <p className="text-green-100 mt-2">
              Track your NearShop delivery
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-14 text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center">
              <Package
                size={42}
                className="text-green-800"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-6">
              No Order Found
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mt-3">
              Place an order first and you can track it here.
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

  const steps = [
    {
      title: "Order Placed",
      description: "Your order has been received",
      icon: Package,
    },
    {
      title: "Shop Confirmed",
      description: "The shop has confirmed your order",
      icon: Store,
    },
    {
      title: "Preparing",
      description: "Your groceries are being prepared",
      icon: ChefHat,
    },
    {
      title: "Out for Delivery",
      description: "Your order is on the way",
      icon: Truck,
    },
    {
      title: "Delivered",
      description: "Your order has been delivered",
      icon: CheckCircle,
    },
  ];

  const currentStep = 0;

  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "Recently";

  return (
    <main className="min-h-screen bg-[#f6f8f4]">

      {/* =========================================
          HEADER
      ========================================== */}
      <section className="bg-green-950 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white text-sm font-semibold transition"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">
            Track Your Order
          </h1>

          <p className="text-green-100 mt-2">
            Order #{order.orderId}
          </p>

        </div>

      </section>

      {/* =========================================
          CONTENT
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* =====================================
              TRACKING
          ====================================== */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-sm text-gray-500">
                    Current Status
                  </p>

                  <h2 className="text-2xl font-extrabold text-green-800 mt-1">
                    Order Placed
                  </h2>

                </div>

                <div className="flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full w-fit">

                  <Clock size={17} />

                  <span className="text-sm font-bold">
                    Processing
                  </span>

                </div>

              </div>

              {/* Desktop Timeline */}
              <div className="hidden sm:block mt-10">

                {steps.map((step, index) => {

                  const Icon = step.icon;

                  const completed = index <= currentStep;

                  return (
                    <div
                      key={step.title}
                      className="relative flex gap-5 pb-9 last:pb-0"
                    >

                      {/* Line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 w-0.5 h-full ${
                            index < currentStep
                              ? "bg-green-700"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          completed
                            ? "bg-green-800 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon size={19} />
                      </div>

                      {/* Text */}
                      <div className="pt-1">

                        <h3
                          className={`font-bold ${
                            completed
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {step.description}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* Mobile Timeline */}
              <div className="sm:hidden mt-8 space-y-5">

                {steps.map((step, index) => {

                  const Icon = step.icon;

                  const completed = index <= currentStep;

                  return (
                    <div
                      key={step.title}
                      className="flex items-start gap-3"
                    >

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          completed
                            ? "bg-green-800 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="pt-1">

                        <h3
                          className={`font-bold text-sm ${
                            completed
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {step.description}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

          {/* =====================================
              ORDER INFORMATION
          ====================================== */}
          <div className="space-y-6">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

              <h2 className="text-xl font-extrabold text-gray-900">
                Order Summary
              </h2>

              <div className="flex justify-between mt-5 text-sm">

                <span className="text-gray-500">
                  Order ID
                </span>

                <span className="font-bold text-gray-900">
                  {order.orderId}
                </span>

              </div>

              <div className="flex justify-between mt-4 text-sm">

                <span className="text-gray-500">
                  Order Date
                </span>

                <span className="font-semibold text-gray-900">
                  {orderDate}
                </span>

              </div>

              <div className="flex justify-between mt-4 text-sm">

                <span className="text-gray-500">
                  Items
                </span>

                <span className="font-semibold text-gray-900">
                  {order.items?.length || 0}
                </span>

              </div>

              <div className="border-t border-gray-100 my-5" />

              <div className="flex justify-between">

                <span className="text-lg font-extrabold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-extrabold text-green-800">
                  ₹{order.total}
                </span>

              </div>

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

                <p>
                  {order.address?.address}
                </p>

                <p>
                  {order.address?.city} -{" "}
                  {order.address?.pincode}
                </p>

                <div className="flex items-center gap-2 mt-3">

                  <Phone
                    size={15}
                    className="text-green-700"
                  />

                  <span>
                    {order.address?.phone}
                  </span>

                </div>

              </div>

            </div>

            {/* Delivery Message */}
            <div className="bg-green-800 rounded-2xl p-5 text-white">

              <div className="flex items-start gap-3">

                <Truck
                  size={22}
                  className="flex-shrink-0 mt-0.5"
                />

                <div>

                  <h3 className="font-bold">
                    Local Delivery
                  </h3>

                  <p className="text-sm text-green-100 mt-1 leading-relaxed">
                    Your groceries will be delivered from
                    your nearby local shop.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">

          <Link
            to="/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-green-200 text-green-800 font-bold hover:bg-green-50 transition"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-800 text-white font-bold hover:bg-green-900 transition"
          >
            Continue Shopping
          </Link>

        </div>

      </section>

    </main>
  );
}

export default OrderTracking;