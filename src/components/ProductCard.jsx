import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const productId = product._id || product.id;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addToCart({
      ...product,
      id: productId,
    });

    setAdded(true);

    toast.success(`${product.name} added to cart`);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Product Image */}
      <Link
        to={`/products/${productId}`}
        className="block relative h-52 sm:h-56 bg-[#f1f7ed] overflow-hidden"
      >
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-5xl">
              🛒
            </div>

            <p className="text-sm mt-2">
              Image unavailable
            </p>
          </div>
        )}

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* View Details */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white text-green-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center">
            <Eye size={18} />
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5">

        {/* Product Name */}
        <Link
          to={`/products/${productId}`}
          className="block"
        >
          <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1 hover:text-green-800 transition">
            {product.name}
          </h3>
        </Link>

        {/* Unit */}
        <p className="text-sm text-gray-500 mt-1">
          {product.unit}
        </p>

        {/* Shop */}
        <p className="text-xs sm:text-sm text-gray-500 mt-2 truncate">
          📍 {product.shop}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">

          <span className="text-xl font-extrabold text-green-800">
            ₹{product.price}
          </span>

          {product.oldPrice &&
            product.oldPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.oldPrice}
              </span>
            )}

        </div>

        {/* Stock */}
        <div className="mt-2">

          {product.stock > 0 ? (
            <span className="text-xs font-semibold text-green-700">
              ✓ In stock
            </span>
          ) : (
            <span className="text-xs font-semibold text-red-600">
              Out of stock
            </span>
          )}

        </div>

        {/* Add To Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm sm:text-base transition-all ${
            product.stock <= 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : added
              ? "bg-green-950 text-white"
              : "bg-green-800 text-white hover:bg-green-900 active:scale-[0.98]"
          }`}
        >
          <ShoppingCart size={18} />

          {product.stock <= 0
            ? "Out of Stock"
            : added
            ? "Added ✓"
            : "Add to Cart"}
        </button>

        {/* View Details */}
        <Link
          to={`/products/${productId}`}
          className="w-full mt-2 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm text-green-800 border border-green-200 hover:bg-green-50 transition"
        >
          <Eye size={17} />
          View Details
        </Link>

      </div>
    </article>
  );
}

export default ProductCard;