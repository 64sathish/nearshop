import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Package,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        setProduct(response.data);
      } catch (error) {
        console.error(
          "Product details error:",
          error
        );

        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (!product) return;

    if (quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        id: product._id,
      });
    }

    toast.success(
      `${product.name} added to cart`
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f4] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-green-200 border-t-green-800 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-green-800 font-bold">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f6f8f4] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center max-w-md w-full">
          <div className="text-6xl">
            🛒
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Product not found
          </h2>

          <p className="text-gray-500 mt-2">
            This product may have been removed.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-6 bg-green-800 text-white px-5 py-3 rounded-xl font-bold hover:bg-green-900"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const discount =
    product.oldPrice &&
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  const totalPrice =
    product.price * quantity;

  return (
    <main className="min-h-screen bg-[#f6f8f4]">

      {/* BACK */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-green-800 font-semibold hover:text-green-950"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

      </section>

      {/* PRODUCT */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* IMAGE */}

            <div className="bg-[#f1f7ed] min-h-[350px] sm:min-h-[450px] flex items-center justify-center p-5 sm:p-8">

              {!imageError && product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={() =>
                    setImageError(true)
                  }
                  className="w-full h-[350px] sm:h-[450px] object-cover rounded-2xl"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-7xl">
                    🛒
                  </div>

                  <p className="mt-3">
                    Image unavailable
                  </p>
                </div>
              )}

            </div>

            {/* DETAILS */}

            <div className="p-6 sm:p-8 lg:p-10">

              {/* CATEGORY */}

              <span className="inline-flex bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold">
                {product.category}
              </span>

              {/* NAME */}

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">
                {product.name}
              </h1>

              {/* UNIT */}

              <p className="text-gray-500 mt-2">
                {product.unit}
              </p>

              {/* PRICE */}

              <div className="flex items-center gap-3 mt-6">

                <span className="text-3xl font-extrabold text-green-800">
                  ₹{product.price}
                </span>

                {product.oldPrice &&
                  product.oldPrice >
                    product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.oldPrice}
                    </span>
                  )}

                {discount > 0 && (
                  <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                    {discount}% OFF
                  </span>
                )}

              </div>

              {/* SHOP */}

              <div className="mt-6 p-4 bg-green-50 rounded-2xl">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-green-800">
                    <Store size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Available at
                    </p>

                    <p className="font-bold text-gray-900">
                      {product.shop}
                    </p>
                  </div>

                </div>

              </div>

              {/* STOCK */}

              <div className="mt-5 flex items-center gap-2">

                <Package
                  size={18}
                  className={
                    product.stock > 0
                      ? "text-green-700"
                      : "text-red-600"
                  }
                />

                {product.stock > 0 ? (
                  <span className="text-green-700 font-semibold text-sm">
                    {product.stock} items available
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold text-sm">
                    Out of stock
                  </span>
                )}

              </div>

              {/* DESCRIPTION */}

              {product.description && (
                <div className="mt-6">

                  <h2 className="font-bold text-gray-900">
                    Product Description
                  </h2>

                  <p className="text-gray-500 text-sm leading-6 mt-2">
                    {product.description}
                  </p>

                </div>
              )}

              {/* DELIVERY */}

              <div className="mt-6 flex items-start gap-3 border-t border-gray-100 pt-5">

                <Truck
                  size={20}
                  className="text-green-700 mt-0.5"
                />

                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Local delivery
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    Fresh groceries delivered from nearby shops.
                  </p>
                </div>

              </div>

              {/* QUANTITY */}

              {product.stock > 0 && (
                <div className="mt-7">

                  <p className="font-bold text-gray-900 mb-2">
                    Quantity
                  </p>

                  <div className="flex items-center gap-3">

                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">

                      <button
                        onClick={
                          decreaseQuantity
                        }
                        className="w-11 h-11 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={17} />
                      </button>

                      <span className="w-12 text-center font-bold">
                        {quantity}
                      </span>

                      <button
                        onClick={
                          increaseQuantity
                        }
                        disabled={
                          quantity >=
                          product.stock
                        }
                        className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:text-gray-300"
                      >
                        <Plus size={17} />
                      </button>

                    </div>

                    <span className="text-sm text-gray-500">
                      {product.unit}
                    </span>

                  </div>

                </div>
              )}

              {/* TOTAL */}

              {product.stock > 0 && (
                <div className="mt-6 flex items-center justify-between">

                  <span className="text-gray-500">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-gray-900">
                    ₹{totalPrice}
                  </span>

                </div>
              )}

              {/* ADD CART */}

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-full mt-5 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition ${
                  product.stock <= 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-800 text-white hover:bg-green-900 active:scale-[0.99]"
                }`}
              >
                <ShoppingCart size={20} />

                {product.stock <= 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              {/* VIEW CART */}

              <Link
                to="/cart"
                className="w-full mt-3 py-3.5 rounded-xl border border-green-700 text-green-800 flex items-center justify-center gap-2 font-bold hover:bg-green-50 transition"
              >
                <ShoppingCart size={18} />
                View Cart
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;