import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  Search,
  Trash2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api/products";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(products.map((product) => product.category)),
    ];
  }, [products]);

  const shops = useMemo(() => {
    return [...new Set(products.map((product) => product.shop))];
  }, [products]);

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <= 5
  ).length;

  const outOfStock = products.filter(
    (product) =>
      Number(product.stock || 0) === 0
  ).length;

  const savedOrder = localStorage.getItem(
    "nearshop-last-order"
  );

  const lastOrder = savedOrder
    ? JSON.parse(savedOrder)
    : null;

  const filteredProducts = products.filter((product) => {
    const search = searchText
      .trim()
      .toLowerCase();

    const matchesSearch =
      !search ||
      product.name
        ?.toLowerCase()
        .includes(search) ||
      product.shop
        ?.toLowerCase()
        .includes(search) ||
      product.category
        ?.toLowerCase()
        .includes(search);

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem(
      "nearshop-token"
    );

    try {
      await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product deleted");

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete product"
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f4]">

      {/* HEADER */}

      <section className="bg-green-950 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          <p className="text-green-200 text-sm font-semibold">
            Administration
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">
            Admin Dashboard
          </h1>

          <p className="text-green-100 mt-2">
            Manage NearShop products, shops and orders
          </p>

        </div>

      </section>

      {/* CONTENT */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Products
                </p>

                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {products.length}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">

                <Package
                  size={22}
                  className="text-green-800"
                />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Shops
                </p>

                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {shops.length}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Store
                  size={22}
                  className="text-blue-700"
                />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Stock
                </p>

                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {totalStock}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">

                <TrendingUp
                  size={22}
                  className="text-purple-700"
                />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Orders
                </p>

                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {lastOrder ? 1 : 0}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">

                <ShoppingBag
                  size={22}
                  className="text-orange-600"
                />

              </div>

            </div>

          </div>

        </div>

        {/* STATUS CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

          <div className="bg-white rounded-2xl border border-gray-100 p-5">

            <p className="text-sm text-gray-500">
              Low Stock
            </p>

            <p className="text-2xl font-extrabold text-orange-600 mt-1">
              {lowStock}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Products need attention
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">

            <p className="text-sm text-gray-500">
              Out of Stock
            </p>

            <p className="text-2xl font-extrabold text-red-600 mt-1">
              {outOfStock}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Products unavailable
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">

            <p className="text-sm text-gray-500">
              Categories
            </p>

            <p className="text-2xl font-extrabold text-green-800 mt-1">
              {categories.length - 1}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Grocery categories
            </p>

          </div>

        </div>

        {/* ORDER SUMMARY */}

        {lastOrder && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mt-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-extrabold text-gray-900">
                  Latest Order
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {lastOrder.orderId}
                </p>

              </div>

              <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-800 text-xs font-bold">
                {lastOrder.status}
              </span>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

              <div>
                <p className="text-xs text-gray-500">
                  Customer
                </p>

                <p className="font-bold text-gray-900 mt-1">
                  {lastOrder.address?.name || "Customer"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Payment
                </p>

                <p className="font-bold text-gray-900 mt-1">
                  {lastOrder.paymentMethod === "upi"
                    ? "UPI"
                    : "Cash on Delivery"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Total
                </p>

                <p className="font-bold text-green-800 mt-1">
                  ₹{lastOrder.total}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* PRODUCT MANAGEMENT */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-gray-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  Product Management
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  View and manage all NearShop products
                </p>

              </div>

              <button
                onClick={fetchProducts}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
              >
                <RefreshCw size={17} />
                Refresh
              </button>

            </div>

            {/* SEARCH */}

            <div className="flex flex-col md:flex-row gap-3 mt-5">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search product or shop..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="md:w-56 px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-700"
              >

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All"
                      ? "All Categories"
                      : item}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* TABLE */}

          {loading ? (
            <div className="p-12 text-center">

              <div className="w-10 h-10 mx-auto border-4 border-green-200 border-t-green-800 rounded-full animate-spin" />

              <p className="text-gray-500 mt-4">
                Loading products...
              </p>

            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">

              <Package
                size={42}
                className="mx-auto text-gray-300"
              />

              <p className="font-bold text-gray-800 mt-4">
                No products found
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Product
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Category
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Shop
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Price
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Stock
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredProducts.map((product) => (

                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                          />

                          <div>

                            <p className="font-bold text-gray-900">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {product.unit}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-800 text-xs font-bold">
                          {product.category}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {product.shop}
                      </td>

                      <td className="px-5 py-4">

                        <p className="font-extrabold text-green-800">
                          ₹{product.price}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`font-bold text-sm ${
                            Number(product.stock || 0) === 0
                              ? "text-red-600"
                              : Number(product.stock || 0) <= 5
                              ? "text-orange-600"
                              : "text-green-700"
                          }`}
                        >
                          {product.stock || 0}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            deleteProduct(product._id)
                          }
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-bold text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;