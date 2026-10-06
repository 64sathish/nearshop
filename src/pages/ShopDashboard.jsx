
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const groceryImages = [
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

function ShopDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    oldPrice: "",
    unit: "",
    shop: "",
    image: "",
    stock: "",
    description: "",
  });

  const [products, setProducts] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("nearshop-token");

  // =====================================
  // GET ALL PRODUCTS
  // =====================================

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load products");
    }
  };

  // =====================================
  // LOAD PRODUCTS
  // =====================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================
  // FORM CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // SELECT IMAGE
  // =====================================

  const selectImage = (imageUrl) => {
    setFormData({
      ...formData,
      image: imageUrl,
    });

    setShowImages(false);

    toast.success("Image selected");
  };

  // =====================================
  // EDIT PRODUCT
  // =====================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      unit: product.unit || "",
      shop: product.shop || "",
      image: product.image || "",
      stock: product.stock || "",
      description: product.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // UPDATE STOCK
  // =====================================

  const updateStock = async (id, newStock) => {
    if (newStock < 0) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          stock: newStock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Stock updated");

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update stock"
      );
    }
  };

  // =====================================
  // DELETE PRODUCT
  // =====================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product deleted successfully");

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  // =====================================
  // ADD / UPDATE PRODUCT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please select a product image");
      return;
    }

    try {
      const productData = {
        ...formData,

        price: Number(formData.price),

        oldPrice: formData.oldPrice
          ? Number(formData.oldPrice)
          : null,

        stock: Number(formData.stock),
      };

      // UPDATE
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Product updated successfully"
        );
      }

      // ADD
      else {
        await axios.post(
          "http://localhost:5000/api/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Product added successfully"
        );
      }

      // RESET FORM

      setFormData({
        name: "",
        category: "",
        price: "",
        oldPrice: "",
        unit: "",
        shop: "",
        image: "",
        stock: "",
        description: "",
      });

      setEditingId(null);

      setShowImages(false);

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // =====================================
  // CANCEL EDIT
  // =====================================

  const cancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: "",
      category: "",
      price: "",
      oldPrice: "",
      unit: "",
      shop: "",
      image: "",
      stock: "",
      description: "",
    });

    setShowImages(false);
  };

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* ================================= */}
        {/* DASHBOARD HEADER */}
        {/* ================================= */}

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">

          <h1 className="text-3xl font-bold text-green-900">
            Shop Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your grocery products and stock
          </p>

        </div>

        {/* ================================= */}
        {/* ADD / EDIT PRODUCT */}
        {/* ================================= */}

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            {editingId
              ? "Edit Product"
              : "Add New Product"}

          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* PRODUCT NAME */}

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product name"
              className="border rounded-lg p-3"
              required
            />

            {/* CATEGORY */}

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="border rounded-lg p-3"
              required
            />

            {/* PRICE */}

            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border rounded-lg p-3"
              required
            />

            {/* OLD PRICE */}

            <input
              name="oldPrice"
              type="number"
              value={formData.oldPrice}
              onChange={handleChange}
              placeholder="Old price"
              className="border rounded-lg p-3"
            />

            {/* UNIT */}

            <input
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Unit (example: 1 kg)"
              className="border rounded-lg p-3"
              required
            />

            {/* SHOP */}

            <input
              name="shop"
              value={formData.shop}
              onChange={handleChange}
              placeholder="Shop name"
              className="border rounded-lg p-3"
              required
            />

            {/* ================================= */}
            {/* IMAGE SECTION */}
            {/* ================================= */}

            <div className="md:col-span-2">

              <button
                type="button"
                onClick={() =>
                  setShowImages(!showImages)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
              >
                {showImages
                  ? "Hide Images"
                  : "Choose Product Image"}
              </button>

              {/* IMAGE LIST */}

              {showImages && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-5">

                  {groceryImages.map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() =>
                        selectImage(item.url)
                      }
                      className="border rounded-lg overflow-hidden hover:ring-4 hover:ring-green-300"
                    >

                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-24 object-cover"
                      />

                      <p className="text-sm font-semibold p-2">
                        {item.name}
                      </p>

                    </button>
                  ))}

                </div>
              )}

              {/* SELECTED IMAGE */}

              {formData.image && (
                <div className="mt-5">

                  <p className="text-sm text-gray-600 mb-2">
                    Selected Image
                  </p>

                  <img
                    src={formData.image}
                    alt="Selected product"
                    className="w-40 h-40 object-cover rounded-xl border"
                  />

                </div>
              )}

            </div>

            {/* STOCK */}

            <input
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock quantity"
              className="border rounded-lg p-3"
            />

            {/* DESCRIPTION */}

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description"
              className="border rounded-lg p-3"
            />

            {/* SUBMIT */}

            <button
              type="submit"
              className="md:col-span-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg"
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {/* CANCEL */}

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="md:col-span-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg"
              >
                Cancel Edit
              </button>
            )}

          </form>

        </div>

        {/* ================================= */}
        {/* PRODUCT LIST */}
        {/* ================================= */}

        <div className="bg-white rounded-xl shadow-sm p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Products
          </h2>

          {products.length === 0 ? (

            <p className="text-gray-500">
              No products found.
            </p>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {products.map((product) => (

                <div
                  key={product._id}
                  className="border rounded-xl overflow-hidden bg-white"
                >

                  {/* PRODUCT IMAGE */}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">

                    {/* NAME */}

                    <h3 className="text-lg font-bold">
                      {product.name}
                    </h3>

                    {/* CATEGORY */}

                    <p className="text-gray-500 text-sm mt-1">
                      {product.category}
                    </p>

                    {/* PRICE */}

                    <p className="text-green-700 font-semibold mt-2">
                      ₹{product.price}
                    </p>

                    {/* UNIT */}

                    <p className="text-gray-500 text-sm">
                      {product.unit}
                    </p>

                    {/* SHOP */}

                    <p className="text-gray-500 text-sm">
                      Shop: {product.shop}
                    </p>

                    {/* ================================= */}
                    {/* STOCK CONTROLS */}
                    {/* ================================= */}

                    <div className="flex items-center justify-between mt-4 bg-gray-50 rounded-lg p-3">

                      <div>

                        <p className="text-sm text-gray-500">
                          Stock
                        </p>

                        <p className="text-lg font-bold text-gray-800">
                          {product.stock}
                        </p>

                      </div>

                      <div className="flex items-center gap-2">

                        {/* DECREASE */}

                        <button
                          onClick={() =>
                            updateStock(
                              product._id,
                              Number(product.stock) - 1
                            )
                          }
                          disabled={
                            Number(product.stock) <= 0
                          }
                          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          −
                        </button>

                        {/* INCREASE */}

                        <button
                          onClick={() =>
                            updateStock(
                              product._id,
                              Number(product.stock) + 1
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-lg"
                        >
                          +
                        </button>

                      </div>

                    </div>

                    {/* ================================= */}
                    {/* EDIT / DELETE */}
                    {/* ================================= */}

                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() =>
                          handleEdit(product)
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product._id)
                        }
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ShopDashboard;
