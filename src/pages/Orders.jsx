import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Package,
  MapPin,
  CreditCard,
  CalendarDays,
  Truck,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("nearshop-token");

      if (!token) {
        setOrders([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Get orders error:", error);

      if (error.response?.status === 401) {
        toast.error("Please login again");
      } else {
        toast.error("Unable to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    if (status === "Delivered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Out for Delivery") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f4] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <p className="text-green-700 font-semibold text-sm">
              NearShop
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              My Orders
            </h1>

            <p className="text-gray-500 mt-2">
              View and track your recent orders.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-green-800 font-semibold hover:bg-green-50 transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 sm:p-16 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center">
              <ShoppingBag
                size={36}
                className="text-green-800"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your completed orders will appear here.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 bg-green-800 hover:bg-green-900 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >

                {/* Order Header */}
                <div className="p-5 sm:p-6 border-b border-gray-100">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Order ID
                      </p>

                      <h2 className="font-extrabold text-gray-900 mt-1">
                        {order.orderId}
                      </h2>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">

                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={15} />
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <CreditCard size={15} />
                          {order.paymentMethod === "upi"
                            ? "UPI"
                            : "Cash on Delivery"}
                        </span>

                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                      <span
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <Link
                        to={`/order-tracking?id=${order._id}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-900 transition"
                      >
                        <Truck size={17} />
                        Track Order
                      </Link>

                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="p-5 sm:p-6">

                  <div className="space-y-4">

                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex gap-4 items-center"
                      >

                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#f1f7ed] overflow-hidden flex-shrink-0">

                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package
                                size={25}
                                className="text-green-700"
                              />
                            </div>
                          )}

                        </div>

                        <div className="flex-1 min-w-0">

                          <h3 className="font-bold text-gray-900 truncate">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {item.unit}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>

                        </div>

                        <div className="font-bold text-green-800">
                          ₹
                          {Number(
                            item.price * item.quantity
                          ).toFixed(0)}
                        </div>

                      </div>
                    ))}

                  </div>

                  {/* Address */}
                  <div className="mt-6 pt-5 border-t border-gray-100">

                    <div className="flex gap-3">

                      <MapPin
                        size={20}
                        className="text-green-700 flex-shrink-0 mt-0.5"
                      />

                      <div>
                        <p className="font-bold text-gray-900">
                          Delivery Address
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {order.address?.address}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.address?.city} -{" "}
                          {order.address?.pincode}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Total */}
                  <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">

                    <span className="text-gray-600 font-semibold">
                      Order Total
                    </span>

                    <span className="text-2xl font-extrabold text-green-800">
                      ₹{Number(order.total || 0).toFixed(0)}
                    </span>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default Orders;