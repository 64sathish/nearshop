import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Package,
  RefreshCw,
  Search,
  Trash2,
  ShoppingBag,
  Users,
  Boxes,
  AlertTriangle,
  MapPin,
  Phone,
  IndianRupee,
  CheckCircle,
  Truck,
  Clock,
  ChefHat,
  Store,
  X,
} from "lucide-react";

function AdminDashboard() {
  // ==========================================
  // STATES
  // ==========================================

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  // ==========================================
  // ORDER STATUS
  // ==========================================

  const orderStatuses = [
    "Order Placed",
    "Shop Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Rice & Grains",
    "Bakery",
    "Beverages",
  ];

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data || []);
    } catch (error) {
      console.error(
        "Get products error:",
        error
      );

      toast.error("Unable to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);

      const token =
        localStorage.getItem("nearshop-token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "Get orders error:",
        error
      );

      if (error.response?.status === 401) {
        toast.error("Please login again");
      } else {
        toast.error("Unable to load orders");
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ==========================================
  // REFRESH EVERYTHING
  // ==========================================

  const refreshDashboard = () => {
    fetchProducts();
    fetchOrders();
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const deleteProduct = async (productId) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        localStorage.getItem("nearshop-token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Product deleted successfully"
      );

      fetchProducts();
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete product"
      );
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const token =
        localStorage.getItem("nearshop-token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrder =
        response.data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );

      toast.success(
        `Order status changed to ${status}`
      );
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts =
    products.filter((product) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.shop
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  const totalProducts =
    products.length;

  const totalOrders =
    orders.length;

  const totalStock =
    products.reduce(
      (total, product) =>
        total +
        Number(product.stock || 0),
      0
    );

  const totalShops =
    new Set(
      products
        .map((product) => product.shop)
        .filter(Boolean)
    ).size;

  const lowStock =
    products.filter(
      (product) =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <= 10
    ).length;

  const outOfStock =
    products.filter(
      (product) =>
        Number(product.stock || 0) <= 0
    ).length;

  const pendingOrders =
    orders.filter(
      (order) =>
        ![
          "Delivered",
          "Cancelled",
        ].includes(order.status)
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.status === "Cancelled"
    ).length;

  const totalRevenue =
    orders
      .filter(
        (order) =>
          order.status !== "Cancelled"
      )
      .reduce(
        (total, order) =>
          total +
          Number(order.total || 0),
        0
      );

  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Out for Delivery":
        return "bg-blue-100 text-blue-700";

      case "Preparing":
        return "bg-purple-100 text-purple-700";

      case "Shop Confirmed":
        return "bg-indigo-100 text-indigo-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={17} />;

      case "Cancelled":
        return <X size={17} />;

      case "Out for Delivery":
        return <Truck size={17} />;

      case "Preparing":
        return <ChefHat size={17} />;

      case "Shop Confirmed":
        return <Store size={17} />;

      default:
        return <Clock size={17} />;
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-[#f6f8f4] py-8 sm:py-12">

      <div className="max-w-7xl mx-auto px-4">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>
            <p className="text-green-700 font-bold text-sm">
              NearShop
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Manage products, shops and customer orders.
            </p>
          </div>

          <button
            onClick={refreshDashboard}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl font-bold text-green-800 hover:bg-green-50 transition"
          >
            <RefreshCw size={18} />
            Refresh Dashboard
          </button>

        </div>

        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

          {/* PRODUCTS */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
              <Package
                size={22}
                className="text-green-700"
              />
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Total Products
            </p>

            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              {totalProducts}
            </p>

          </div>

          {/* ORDERS */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingBag
                size={22}
                className="text-blue-700"
              />
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Total Orders
            </p>

            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              {totalOrders}
            </p>

          </div>

          {/* SHOPS */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users
                size={22}
                className="text-purple-700"
              />
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Total Shops
            </p>

            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              {totalShops}
            </p>

          </div>

          {/* STOCK */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
              <Boxes
                size={22}
                className="text-orange-700"
              />
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Total Stock
            </p>

            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              {totalStock}
            </p>

          </div>

        </div>

        {/* =====================================
            SECONDARY STATISTICS
        ===================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Pending Orders
            </p>

            <p className="text-2xl font-extrabold text-yellow-600 mt-2">
              {pendingOrders}
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="text-2xl font-extrabold text-green-700 mt-2">
              {deliveredOrders}
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Cancelled
            </p>

            <p className="text-2xl font-extrabold text-red-600 mt-2">
              {cancelledOrders}
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Low Stock
            </p>

            <p className="text-2xl font-extrabold text-orange-600 mt-2">
              {lowStock}
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Revenue
            </p>

            <p className="text-2xl font-extrabold text-green-800 mt-2">
              ₹{totalRevenue.toFixed(0)}
            </p>

          </div>

        </div>

        {/* =====================================
            ORDERS
        ===================================== */}

        <section className="mb-12">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                All Customer Orders
              </h2>

              <p className="text-gray-500 mt-1">
                Monitor and manage every order.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-green-800 font-bold hover:bg-green-50"
            >
              <RefreshCw size={17} />
              Refresh Orders
            </button>

          </div>

          {loadingOrders ? (

            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">

              <div className="w-11 h-11 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="text-gray-500 mt-4">
                Loading orders...
              </p>

            </div>

          ) : orders.length === 0 ? (

            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">

              <ShoppingBag
                size={50}
                className="mx-auto text-gray-300"
              />

              <h3 className="text-xl font-bold text-gray-900 mt-4">
                No orders found
              </h3>

              <p className="text-gray-500 mt-2">
                Customer orders will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >

                  {/* ORDER HEADER */}

                  <div className="p-5 sm:p-6 border-b border-gray-100">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      <div>

                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Order ID
                        </p>

                        <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                          {order.orderId}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(
                            order.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      <span
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(
                          order.status
                        )}

                        {order.status}
                      </span>

                    </div>

                  </div>

                  {/* ORDER CONTENT */}

                  <div className="p-5 sm:p-6">

                    <div className="grid lg:grid-cols-3 gap-6">

                      {/* CUSTOMER */}

                      <div className="bg-gray-50 rounded-2xl p-5">

                        <h4 className="font-extrabold text-gray-900 mb-4">
                          Customer
                        </h4>

                        <p className="font-bold text-gray-900">
                          {order.customerName}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                          <Phone size={16} />

                          {order.phone}
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-500 mt-3">

                          <MapPin
                            size={17}
                            className="flex-shrink-0 mt-0.5"
                          />

                          <span>
                            {order.address?.address}
                            <br />
                            {order.address?.city} -{" "}
                            {order.address?.pincode}
                          </span>

                        </div>

                      </div>

                      {/* ITEMS */}

                      <div>

                        <h4 className="font-extrabold text-gray-900 mb-4">
                          Ordered Items
                        </h4>

                        <div className="space-y-3">

                          {order.items?.map(
                            (item, index) => (

                              <div
                                key={`${order._id}-${index}`}
                                className="flex items-center gap-3"
                              >

                                <div className="w-12 h-12 rounded-xl bg-[#f1f7ed] overflow-hidden flex-shrink-0">

                                  {item.image ? (

                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />

                                  ) : (

                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package
                                        size={20}
                                        className="text-green-700"
                                      />
                                    </div>

                                  )}

                                </div>

                                <div className="flex-1 min-w-0">

                                  <p className="font-bold text-gray-900 truncate">
                                    {item.name}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                  </p>

                                </div>

                                <p className="font-bold text-green-800">
                                  ₹
                                  {Number(
                                    item.price *
                                      item.quantity
                                  ).toFixed(0)}
                                </p>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                      {/* SUMMARY */}

                      <div className="bg-green-50 rounded-2xl p-5">

                        <h4 className="font-extrabold text-gray-900">
                          Order Summary
                        </h4>

                        <div className="flex justify-between mt-4 text-sm">

                          <span className="text-gray-500">
                            Subtotal
                          </span>

                          <span className="font-semibold">
                            ₹
                            {Number(
                              order.subtotal || 0
                            ).toFixed(0)}
                          </span>

                        </div>

                        <div className="flex justify-between mt-2 text-sm">

                          <span className="text-gray-500">
                            Delivery
                          </span>

                          <span className="font-semibold">
                            ₹
                            {Number(
                              order.deliveryCharge ||
                                0
                            ).toFixed(0)}
                          </span>

                        </div>

                        <div className="border-t border-green-200 mt-4 pt-4 flex justify-between items-center">

                          <span className="font-bold text-gray-900">
                            Total
                          </span>

                          <span className="text-2xl font-extrabold text-green-800">
                            ₹
                            {Number(
                              order.total || 0
                            ).toFixed(0)}
                          </span>

                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                          Payment:{" "}
                          {order.paymentMethod ===
                          "upi"
                            ? "UPI"
                            : "Cash on Delivery"}
                        </p>

                      </div>

                    </div>

                    {/* STATUS CONTROL */}

                    <div className="mt-7 pt-6 border-t border-gray-100">

                      <div className="flex flex-col gap-4">

                        <div>

                          <h4 className="font-extrabold text-gray-900">
                            Manage Order Status
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            Updating this status also updates customer order tracking.
                          </p>

                        </div>

                        <div className="flex flex-wrap gap-2">

                          {orderStatuses.map(
                            (status) => (

                              <button
                                key={status}
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    status
                                  )
                                }
                                disabled={
                                  updatingOrderId ===
                                    order._id ||
                                  order.status ===
                                    status
                                }
                                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                                  order.status ===
                                  status
                                    ? "bg-green-800 text-white border-green-800"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300"
                                } ${
                                  updatingOrderId ===
                                    order._id ||
                                  order.status ===
                                    status
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                {status}
                              </button>

                            )
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* =====================================
            PRODUCT MANAGEMENT
        ===================================== */}

        <section>

          <div className="mb-5">

            <h2 className="text-2xl font-extrabold text-gray-900">
              Product Management
            </h2>

            <p className="text-gray-500 mt-1">
              Search, filter and manage all products.
            </p>

          </div>

          {/* SEARCH + FILTER */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">

            <div className="grid md:grid-cols-2 gap-4">

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search product or shop..."
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                />

              </div>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
              >

                <option value="All">
                  All Categories
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* PRODUCTS */}

          {loadingProducts ? (

            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">

              <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="text-gray-500 mt-4">
                Loading products...
              </p>

            </div>

          ) : filteredProducts.length ===
            0 ? (

            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">

              <Package
                size={50}
                className="mx-auto text-gray-300"
              />

              <h3 className="text-xl font-bold text-gray-900 mt-4">
                No products found
              </h3>

              <p className="text-gray-500 mt-2">
                Try another search or category.
              </p>

            </div>

          ) : (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {filteredProducts.map(
                (product) => (

                  <div
                    key={product._id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
                  >

                    <div className="h-48 bg-[#f1f7ed]">

                      {product.image ? (

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>

                      )}

                    </div>

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-xs font-bold text-green-700">
                            {product.category}
                          </p>

                          <h3 className="font-extrabold text-gray-900 mt-1">
                            {product.name}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {product.unit}
                          </p>

                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            Number(
                              product.stock || 0
                            ) <= 0
                              ? "bg-red-100 text-red-700"
                              : Number(
                                  product.stock
                                ) <= 10
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.stock || 0} stock
                        </span>

                      </div>

                      <div className="flex items-center gap-2 mt-4">

                        <span className="text-xl font-extrabold text-green-800">
                          ₹{product.price}
                        </span>

                        {product.oldPrice &&
                          product.oldPrice >
                            product.price && (

                            <span className="text-sm text-gray-400 line-through">
                              ₹
                              {
                                product.oldPrice
                              }
                            </span>

                          )}

                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        Shop: {product.shop}
                      </p>

                      <button
                        onClick={() =>
                          deleteProduct(
                            product._id
                          )
                        }
                        className="w-full mt-5 inline-flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-50 transition"
                      >
                        <Trash2 size={17} />
                        Delete Product
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* =====================================
            FOOTER INFORMATION
        ===================================== */}

        <div className="mt-10 bg-green-950 text-white rounded-3xl p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h3 className="text-xl font-extrabold">
                NearShop Admin
              </h3>

              <p className="text-green-200 text-sm mt-1">
                Complete marketplace management dashboard.
              </p>

            </div>

            <div className="text-sm text-green-200">
              Products: {totalProducts} · Orders:{" "}
              {totalOrders} · Shops:{" "}
              {totalShops}
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default AdminDashboard;