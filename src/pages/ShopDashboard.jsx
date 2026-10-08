import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Package,
  RefreshCw,
  MapPin,
  Phone,
  IndianRupee,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  ChefHat,
  Store,
} from "lucide-react";

function ShopDashboard() {
  // ==========================================
  // PRODUCT STATES
  // ==========================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    oldPrice: "",
    unit: "",
    shop: "",
    image: "",
    stock: "",
    description: "",
  });

  // ==========================================
  // ORDER STATES
  // ==========================================

  const [orders, setOrders] = useState([]);

  const [ordersLoading, setOrdersLoading] = useState(false);

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // ==========================================
  // IMAGE LIST
  // ==========================================

  const imageOptions = [
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80",

    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",

    "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",

    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",

    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",

    "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
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
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data || []);
    } catch (error) {
      console.error("Get products error:", error);

      toast.error("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);

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
      console.error("Get orders error:", error);

      if (error.response?.status === 401) {
        toast.error("Please login again");
      } else {
        toast.error("Unable to load orders");
      }
    } finally {
      setOrdersLoading(false);
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
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      category: "Vegetables",
      price: "",
      oldPrice: "",
      unit: "",
      shop: "",
      image: imageOptions[0],
      stock: "",
      description: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      category: product.category || "Vegetables",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      unit: product.unit || "",
      shop: product.shop || "",
      image: product.image || "",
      stock: product.stock || "",
      description: product.description || "",
    });

    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // ==========================================
  // SAVE PRODUCT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setFormLoading(true);

      const token =
        localStorage.getItem("nearshop-token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        oldPrice: formData.oldPrice
          ? Number(formData.oldPrice)
          : null,
        unit: formData.unit,
        shop: formData.shop,
        image: formData.image,
        stock: Number(formData.stock || 0),
        description: formData.description,
      };

      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Product updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Product added successfully");
      }

      closeForm();

      fetchProducts();
    } catch (error) {
      console.error("Save product error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save product"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        localStorage.getItem("nearshop-token");

      await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product deleted");

      fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);

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

      const updatedOrder = response.data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );

      toast.success(
        `Order updated to "${status}"`
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

  const filteredProducts = products.filter(
    (product) => {
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
    }
  );

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <= 10
  ).length;

  const outOfStock = products.filter(
    (product) =>
      Number(product.stock || 0) <= 0
  ).length;

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      ![
        "Delivered",
        "Cancelled",
      ].includes(order.status)
  ).length;

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

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <p className="text-green-700 font-bold text-sm">
              NearShop
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              Shop Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your products and customer orders.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                fetchProducts();
                fetchOrders();
              }}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl font-bold text-green-800 hover:bg-green-50 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white px-5 py-3 rounded-xl font-bold transition"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <Package className="text-green-700" />

            <p className="text-sm text-gray-500 mt-4">
              Products
            </p>

            <p className="text-2xl font-extrabold text-gray-900">
              {totalProducts}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <ShoppingBag className="text-blue-700" />

            <p className="text-sm text-gray-500 mt-4">
              Orders
            </p>

            <p className="text-2xl font-extrabold text-gray-900">
              {totalOrders}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <Clock className="text-yellow-600" />

            <p className="text-sm text-gray-500 mt-4">
              Pending Orders
            </p>

            <p className="text-2xl font-extrabold text-gray-900">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <Package className="text-purple-700" />

            <p className="text-sm text-gray-500 mt-4">
              Total Stock
            </p>

            <p className="text-2xl font-extrabold text-gray-900">
              {totalStock}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 font-bold">
                ⚠
              </span>

              <p className="text-sm text-gray-500">
                Low Stock
              </p>
            </div>

            <p className="text-2xl font-extrabold text-gray-900 mt-4">
              {lowStock}
            </p>

            <p className="text-xs text-red-500 mt-1">
              {outOfStock} out of stock
            </p>
          </div>
        </div>

        {/* ======================================
            ORDERS SECTION
        ====================================== */}

        <section className="mb-12">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Customer Orders
              </h2>

              <p className="text-gray-500 mt-1">
                Confirm and update customer orders.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-green-800 font-bold hover:bg-green-50"
            >
              <RefreshCw size={17} />
              Refresh Orders
            </button>
          </div>

          {ordersLoading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="text-gray-500 mt-4">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <ShoppingBag
                size={48}
                className="mx-auto text-gray-300"
              />

              <h3 className="text-xl font-bold text-gray-900 mt-4">
                No orders yet
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

                      <div className="flex flex-col sm:flex-row gap-3">

                        <span
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* ORDER BODY */}

                  <div className="p-5 sm:p-6">

                    <div className="grid lg:grid-cols-3 gap-6">

                      {/* CUSTOMER */}

                      <div className="bg-gray-50 rounded-2xl p-5">

                        <h4 className="font-extrabold text-gray-900 mb-4">
                          Customer Details
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
                            size={16}
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

                      <div className="lg:col-span-1">

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

                      {/* TOTAL */}

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

                          <span className="text-2xl font-extrabold text-green-800 flex items-center">
                            <IndianRupee
                              size={20}
                            />
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

                    {/* STATUS UPDATE */}

                    <div className="mt-7 pt-6 border-t border-gray-100">

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>
                          <h4 className="font-extrabold text-gray-900">
                            Update Order Status
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            Customer tracking will update automatically.
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
                                    ? "cursor-not-allowed opacity-70"
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

        {/* ======================================
            PRODUCTS SECTION
        ====================================== */}

        <section>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-5">

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Product Management
              </h2>

              <p className="text-gray-500 mt-1">
                Add, edit and manage your shop products.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 bg-green-800 hover:bg-green-900 text-white px-5 py-3 rounded-xl font-bold"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* SEARCH */}

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
                    setSearch(event.target.value)
                  }
                  placeholder="Search products or shops..."
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                />

              </div>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="All">
                  All Categories
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* PRODUCT LIST */}

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center">
              <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="text-gray-500 mt-4">
                Loading products...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <Package
                size={50}
                className="mx-auto text-gray-300"
              />

              <h3 className="text-xl font-bold text-gray-900 mt-4">
                No products found
              </h3>
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
                          Stock{" "}
                          {product.stock || 0}
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
                              ₹{product.oldPrice}
                            </span>
                          )}

                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        Shop: {product.shop}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-5">

                        <button
                          onClick={() =>
                            openEditForm(product)
                          }
                          className="inline-flex items-center justify-center gap-2 border border-green-200 text-green-800 py-2.5 rounded-xl font-bold hover:bg-green-50"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                      </div>

                    </div>
                  </div>
                )
              )}

            </div>
          )}

        </section>
      </div>

      {/* ========================================
          ADD / EDIT PRODUCT MODAL
      ======================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">

          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl my-8">

            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">

              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter product information below.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-5"
            >

              <div className="grid sm:grid-cols-2 gap-4">

                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Product Name
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Fresh Tomato"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  >
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

              <div className="grid sm:grid-cols-3 gap-4">

                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                    placeholder="40"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Old Price
                  </label>

                  <input
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    min="0"
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                    placeholder="100"
                  />
                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Unit
                  </label>

                  <input
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                    placeholder="1 kg"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Shop Name
                  </label>

                  <input
                    name="shop"
                    value={formData.shop}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                    placeholder="Sri Murugan Stores"
                  />
                </div>

              </div>

              <div>
                <label className="text-sm font-bold text-gray-700">
                  Product Image URL
                </label>

                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  placeholder="https://..."
                />

                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">

                  {imageOptions.map(
                    (image, index) => (
                      <button
                        type="button"
                        key={image}
                        onClick={() =>
                          setFormData(
                            (current) => ({
                              ...current,
                              image,
                            })
                          )
                        }
                        className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 ${
                          formData.image === image
                            ? "border-green-800"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Option ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  )}

                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none"
                  placeholder="Fresh quality product..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-green-800 hover:bg-green-900 text-white py-3 rounded-xl font-bold disabled:opacity-60"
                >
                  {formLoading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default ShopDashboard;