import { Link } from "react-router-dom";

function Orders() {
  const savedOrder = localStorage.getItem("nearshop-last-order");

  const order = savedOrder ? JSON.parse(savedOrder) : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <h1 className="text-3xl font-bold text-gray-800">
            My Orders
          </h1>

          <p className="text-gray-500 mt-3 mb-8">
            You have not placed any orders yet.
          </p>

          <Link
            to="/products"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
          >
            Start Shopping
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Orders
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">

            <div>
              <p className="text-sm text-gray-500">
                Order ID
              </p>

              <h2 className="font-bold text-lg text-gray-800">
                {order.orderId}
              </h2>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Order Date
              </p>

              <p className="font-medium text-gray-800">
                {order.orderDate}
              </p>
            </div>

            <div>
              <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                Order Placed
              </span>
            </div>

          </div>

          <div className="py-6">

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Ordered Products
            </h2>

            <div className="space-y-4">

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >

                  <div className="w-20 h-20 bg-green-50 rounded-lg overflow-hidden">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <div className="flex-1">

                    <h3 className="font-semibold text-gray-800">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₹{item.price}
                    </p>

                    <p className="text-sm text-gray-500">
                      Shop: {item.shop}
                    </p>

                  </div>

                  <p className="font-bold text-gray-800">
                    ₹{item.price * item.quantity}
                  </p>

                </div>
              ))}

            </div>

          </div>

          <div className="border-t pt-5">

            <div className="flex justify-between mb-3">
              <span className="text-gray-600">
                Subtotal
              </span>

              <span>
                ₹{order.subtotal}
              </span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-gray-600">
                Delivery
              </span>

              <span>
                {order.deliveryCharge === 0
                  ? "FREE"
                  : `₹${order.deliveryCharge}`}
              </span>
            </div>

            <div className="flex justify-between border-t pt-4 text-xl font-bold">

              <span>
                Total
              </span>

              <span className="text-green-700">
                ₹{order.total}
              </span>

            </div>

          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">

            <Link
              to="/products"
              className="text-center bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="text-center border border-green-700 text-green-700 px-6 py-3 rounded-lg hover:bg-green-50"
            >
              Back to Home
            </Link>
            <Link
  to="/order-tracking"
  className="text-center border border-green-700 text-green-700 px-6 py-3 rounded-lg hover:bg-green-50"
>
  Track Order
</Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Orders;