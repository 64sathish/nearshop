import { Link } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
} from "lucide-react";

function OrderTracking() {
  const savedOrder = localStorage.getItem("nearshop-last-order");

  const order = savedOrder ? JSON.parse(savedOrder) : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">

          <h1 className="text-2xl font-bold text-gray-800">
            No Order Found
          </h1>

          <p className="text-gray-500 mt-2 mb-6">
            Please place an order first.
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

  const trackingSteps = [
    {
      title: "Order Placed",
      description: "Your order has been successfully placed.",
      icon: CheckCircle,
      completed: true,
    },
    {
      title: "Shop Confirmed",
      description: "The shop has received your order.",
      icon: Package,
      completed: true,
    },
    {
      title: "Preparing",
      description: "Your groceries are being prepared.",
      icon: Package,
      completed: true,
    },
    {
      title: "Out for Delivery",
      description: "Your order is on the way.",
      icon: Truck,
      completed: false,
    },
    {
      title: "Delivered",
      description: "Your order has been delivered.",
      icon: Home,
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Track Your Order
        </h1>

        <p className="text-gray-500 mb-8">
          Order ID: {order.orderId}
        </p>

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-8">
            Delivery Status
          </h2>

          <div className="space-y-8">

            {trackingSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="flex gap-5"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-700 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    {index !== trackingSteps.length - 1 && (
                      <div
                        className={`w-1 h-12 mt-2 ${
                          step.completed
                            ? "bg-green-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}

                  </div>

                  <div className="pt-1">

                    <h3
                      className={`text-lg font-bold ${
                        step.completed
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {step.description}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

          <div className="border-t mt-8 pt-6">

            <h2 className="font-bold text-gray-800 mb-3">
              Delivery Address
            </h2>

            <p className="text-gray-600">
              {order.customer.name}
            </p>

            <p className="text-gray-600">
              {order.customer.address}
            </p>

            <p className="text-gray-600">
              {order.customer.city} - {order.customer.pincode}
            </p>

            <p className="text-gray-600">
              Phone: {order.customer.phone}
            </p>

          </div>

          <div className="mt-8 flex gap-3">

            <Link
              to="/orders"
              className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
            >
              My Orders
            </Link>

            <Link
              to="/products"
              className="border border-green-700 text-green-700 px-6 py-3 rounded-lg hover:bg-green-50"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OrderTracking;