import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  Store,
  TrendingUp,
  AlertTriangle,
  X,
  Minus,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api/products";

const categories = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Rice & Grains",
  "Bakery",
  "Beverages",
];

const productImages = [
  {
    name: "Tomato",
    url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Potato",
    url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Carrot",
    url: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Apple",
    url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Banana",
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Orange",
    url: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  },
];

const initialForm = {
  name: "",
  category: "Vegetables",
  price: "",
  oldPrice: "",
  unit: "",
  shop: "",
  image: "",
  stock: 10,
  description: "",
};

function ShopDashboard() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [filterCategory, setFilterCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("nearshop-token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================================
  // FETCH PRODUCTS
  // =========================================

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

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================
  // IMAGE SELECT
  // =========================================

  const selectImage = (url) => {
    setForm((current) => ({
      ...current,
      image: url,
    }));
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  // =========================================
  // EDIT PRODUCT
  // =========================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      category: product.category || "Vegetables",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      unit: product.unit || "",
      shop: product.shop || "",
      image: product.image || "",
      stock: product.stock ?? 0,
      description: product.description || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // SAVE PRODUCT
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.category ||
      !form.price ||
      !form.unit.trim() ||
      !form.shop.trim() ||
      !form.image.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        oldPrice: form.oldPrice
          ? Number(form.oldPrice)
          : null,
        unit: form.unit.trim(),
        shop: form.shop.trim(),
        image: form.image.trim(),
        stock: Number(form.stock) || 0,
        description: form.description.trim(),
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          productData,
          authConfig
        );

        toast.success("Product updated successfully");
      } else {
        await axios.post(
          API_URL,
          productData,
          authConfig
        );

        toast.success("Product added successfully");
      }

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // DELETE PRODUCT
  // =========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/${id}`,
        authConfig
      );

      toast.success("Product deleted successfully");

      await fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete product"
      );
    }
  };

  // =========================================
  // STOCK CHANGE
  // =========================================

  const updateStock = async (product, amount) => {
    const newStock = Math.max(
      0,
      Number(product.stock || 0) + amount
    );

    try {
      await axios.put(
        `${API_URL}/${product._id}`,
        {
          stock: newStock,
        },
        authConfig
      );

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item._id === product._id
            ? {
                ...item,
                stock: newStock,
              }
            : item
        )
      );

      toast.success("Stock updated");
    } catch (error) {
      console.error(error);

      toast.error("Unable to update stock");
    }
  };

  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const filteredProducts = useMemo(() => {
    const search = searchText
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        filterCategory === "All" ||
        product.category === filterCategory;

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

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    products,
    searchText,
    filterCategory,
  ]);

  // =========================================
  // STATISTICS
  // =========================================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <= 5
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) === 0
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f8f4]">

      {/* =========================================
          HEADER
      ========================================== */}

      <section className="bg-green-950 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-green-200 text-sm font-semibold">
                Shop Management
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">
                Shop Dashboard
              </h1>

              <p className="text-green-100 mt-2">
                Manage your grocery products and stock
              </p>

            </div>

            <button
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-green-900 px-5 py-3 rounded-xl font-bold hover:bg-green-50 transition"
            >
              <Plus size={19} />
              Add Product
            </button>

          </div>

        </div>

      </section>

      {/* =========================================
          CONTENT
      ========================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =====================================
            STATISTICS
        ====================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Products */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Products
                </p>

                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                  {totalProducts}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">

                <Package
                  size={21}
                  className="text-green-800"
                />

              </div>

            </div>

          </div>

          {/* Stock */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs sm:text-sm text-gray-500">
                  Total Stock
                </p>

                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                  {totalStock}
                </p>

              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                <TrendingUp
                  size={21}
                  className="text-blue-700"
                />

              </div>

            </div>

          </div>

          {/* Low Stock */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs sm:text-sm text-gray-500">
                  Low Stock
                </p>

                <p className="text-2xl sm:text-3xl font-extrabold text-orange-600 mt-1">
                  {lowStockProducts}
                </p>

              </div>

              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">

                <AlertTriangle
                  size={21}
                  className="text-orange-600"
                />

              </div>

            </div>

          </div>

          {/* Out of Stock */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs sm:text-sm text-gray-500">
                  Out of Stock
                </p>

                <p className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">
                  {outOfStockProducts}
                </p>

              </div>

              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">

                <Package
                  size={21}
                  className="text-red-600"
                />

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            ADD / EDIT FORM
        ====================================== */}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 mt-6">

            <div className="flex items-center justify-between gap-4 mb-6">

              <div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {editingId
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter the grocery product details below.
                </p>

              </div>

              <button
                onClick={resetForm}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Name */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Fresh Tomato"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* Category */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  >

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}

                  </select>

                </div>

                {/* Price */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="40"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* Old Price */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Old Price
                  </label>

                  <input
                    type="number"
                    name="oldPrice"
                    value={form.oldPrice}
                    onChange={handleChange}
                    placeholder="50"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* Unit */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Unit *
                  </label>

                  <input
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="1 kg"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* Shop */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Shop Name *
                  </label>

                  <input
                    type="text"
                    name="shop"
                    value={form.shop}
                    onChange={handleChange}
                    placeholder="Sri Murugan Stores"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* Stock */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />

                </div>

              </div>

              {/* Description */}

              <div>

                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Fresh quality grocery product..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* Image */}

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <ImageIcon
                    size={18}
                    className="text-green-800"
                  />

                  <label className="text-sm font-bold text-gray-700">
                    Product Image *
                  </label>

                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">

                  {productImages.map((image) => (

                    <button
                      type="button"
                      key={image.name}
                      onClick={() =>
                        selectImage(image.url)
                      }
                      className={`rounded-xl overflow-hidden border-2 transition ${
                        form.image === image.url
                          ? "border-green-700 ring-2 ring-green-100"
                          : "border-gray-100 hover:border-green-300"
                      }`}
                    >

                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-20 object-cover"
                      />

                      <p className="text-[10px] font-semibold text-gray-600 py-1 bg-white">
                        {image.name}
                      </p>

                    </button>

                  ))}

                </div>

                {/* Selected Image */}

                {form.image && (
                  <div className="mt-4 flex items-center gap-3">

                    <img
                      src={form.image}
                      alt="Selected"
                      className="w-16 h-16 rounded-xl object-cover border"
                    />

                    <div>

                      <p className="text-xs text-green-700 font-semibold">
                        Image selected
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            image: "",
                          }))
                        }
                        className="text-xs text-red-600 mt-1"
                      >
                        Remove image
                      </button>

                    </div>

                  </div>
                )}

              </div>

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-none sm:min-w-44 bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =====================================
            SEARCH / FILTER
        ====================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mt-6">

          <div className="flex flex-col md:flex-row gap-3">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* Category */}

            <select
              value={filterCategory}
              onChange={(event) =>
                setFilterCategory(event.target.value)
              }
              className="md:w-56 px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-700"
            >

              <option value="All">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* =====================================
            PRODUCT LIST
        ====================================== */}

        <div className="mt-6">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Products
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredProducts.length} products
              </p>

            </div>

          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center">

              <div className="w-10 h-10 border-4 border-green-200 border-t-green-800 rounded-full animate-spin mx-auto" />

              <p className="text-gray-500 mt-4">
                Loading products...
              </p>

            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">

              <Package
                size={42}
                className="mx-auto text-gray-300"
              />

              <h3 className="font-bold text-gray-900 mt-4">
                No products found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try another search or add a new product.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {filteredProducts.map((product) => (

                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition"
                >

                  {/* Image */}

                  <div className="relative h-52 bg-[#f1f7ed]">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    <span className="absolute top-3 left-3 bg-white/95 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">
                      {product.category}
                    </span>

                    {Number(product.stock || 0) === 0 && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        Out of Stock
                      </span>
                    )}

                  </div>

                  {/* Details */}

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h3 className="font-extrabold text-gray-900 text-lg truncate">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {product.unit}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-lg font-extrabold text-green-800">
                          ₹{product.price}
                        </p>

                        {product.oldPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ₹{product.oldPrice}
                          </p>
                        )}

                      </div>

                    </div>

                    <p className="text-sm text-gray-500 mt-3 truncate">
                      📍 {product.shop}
                    </p>

                    {/* Stock Controls */}

                    <div className="flex items-center justify-between mt-5 p-3 bg-gray-50 rounded-xl">

                      <div>

                        <p className="text-xs text-gray-500">
                          Available Stock
                        </p>

                        <p
                          className={`font-extrabold mt-1 ${
                            Number(product.stock || 0) === 0
                              ? "text-red-600"
                              : Number(product.stock || 0) <= 5
                              ? "text-orange-600"
                              : "text-green-700"
                          }`}
                        >
                          {product.stock || 0} units
                        </p>

                      </div>

                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">

                        <button
                          onClick={() =>
                            updateStock(product, -1)
                          }
                          disabled={
                            Number(product.stock || 0) <= 0
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-red-50 disabled:opacity-40"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="w-8 text-center text-sm font-bold">
                          {product.stock || 0}
                        </span>

                        <button
                          onClick={() =>
                            updateStock(product, 1)
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-green-50"
                        >
                          <Plus size={15} />
                        </button>

                      </div>

                    </div>

                    {/* Actions */}

                    <div className="grid grid-cols-2 gap-3 mt-4">

                      <button
                        onClick={() =>
                          handleEdit(product)
                        }
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-green-200 text-green-800 font-bold text-sm hover:bg-green-50 transition"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product._id)
                        }
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default ShopDashboard;