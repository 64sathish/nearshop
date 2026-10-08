import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Package,
  Store,
  ChefHat,
  Truck,
  Home,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function OrderTracking() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("nearshop-token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      if (!orderId) {
        toast.error("Order ID not found");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data.order);
    } catch (error) {
      console.error("Order tracking error:", error);

      if (error.response?.status === 401) {
        toast.error("Please login again");
      } else if (error.response?.status === 404) {
        toast.error("Order not found");
      } else {
        toast.error("Unable to load order");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const steps = [
    {
      name: "Order Placed",
      icon: Package,
      description: "Your order has been placed successfully.",
    },
    {
      name: "Shop Confirmed",
      icon: Store,
      description: "The shop has confirmed your order.",
    },
    {
      name: "Preparing",
      icon: ChefHat,
      description: "Your items are being prepared.",
    },
    {
      name: "Out for Delivery",
      icon: Truck,
      description: "Your order is on the way.",
    },
    {
      name: "Delivered",
      icon: Home,
      description: "Your order has been delivered.",
    },
  ];

  const currentStep = order
    ? steps.findIndex(
        (step) => step.name === order.status
      )
    : -1;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f6f8f4] py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">

            <Package
              size={50}
              className="mx-auto text-gray-400"
            />

            <h1 className="text-2xl font-bold text-gray-900 mt-5">
              Order not found
            </h1>

            <p className="text-gray-500 mt-2">
              We couldn't find this order.
            </p>

            <Link
              to="/orders"
              className="inline-flex items-center gap-2 mt-6 bg-green-800 text-white px-5 py-3 rounded-xl font-bold"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f4] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-green-800 font-semibold text-sm"
            >
              <ArrowLeft size={17} />
              Back to Orders
            </Link>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Track Order
            </h1>

            <p className="text-gray-500 mt-1">
              Order #{order.orderId}
            </p>
          </div>

          <button
            onClick={fetchOrder}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl font-semibold text-green-800 hover:bg-green-50"
          >
            <RefreshCw size={18} />
            Refresh Status
          </button>

        </div>

        {/* Cancelled */}
        {order.status === "Cancelled" ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">

            <div className="text-5xl">❌</div>

            <h2 className="text-2xl font-extrabold text-red-700 mt-4">
              Order Cancelled
            </h2>

            <p className="text-red-600 mt-2">
              This order has been cancelled.
            </p>

          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">

            <div className="space-y-8">

              {steps.map((step, index) => {
                const Icon = step.icon;

                const completed =
                  currentStep >= index;

                const active =
                  currentStep === index;

                return (
                  <div
                    key={step.name}
                    className="flex gap-4 sm:gap-6"
                  >

                    {/* Timeline */}
                    <div className="flex flex-col items-center">

                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          completed
                            ? "bg-green-800 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle size={22} />
                        ) : (
                          <Icon size={22} />
                        )}
                      </div>

                      {index < steps.length - 1 && (
                        <div
                          className={`w-1 h-14 mt-2 rounded-full ${
                            currentStep > index
                              ? "bg-green-800"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                    </div>

                    {/* Content */}
                    <div className="pt-1">

                      <h3
                        className={`font-extrabold text-lg ${
                          active
                            ? "text-green-800"
                            : completed
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </h3>

                      <p
                        className={`text-sm mt-1 ${
                          completed
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>

                      {active && (
                        <span className="inline-block mt-3 text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          Current Status
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

            {/* Order Summary */}
            <div className="mt-10 pt-6 border-t border-gray-100">

              <div className="grid sm:grid-cols-2 gap-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-bold text-gray-900 mt-1">
                    {order.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <p className="font-bold text-gray-900 mt-1">
                    {order.paymentMethod === "upi"
                      ? "UPI"
                      : "Cash on Delivery"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Delivery Address
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {order.address?.address}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.address?.city} -{" "}
                    {order.address?.pincode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-2xl font-extrabold text-green-800 mt-1">
                    ₹{Number(order.total || 0).toFixed(0)}
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default OrderTracking;