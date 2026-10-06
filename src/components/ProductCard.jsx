import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);

    setAdded(true);

    toast.success(`${product.name} added to cart`);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">

      {/* Product Image */}
      <div className="h-48 bg-green-50 overflow-hidden flex items-center justify-center">

        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-5xl mb-2">🛒</div>
            <p className="text-sm">
              Image not available
            </p>
          </div>
        )}

      </div>

      {/* Product Details */}
      <div className="p-4">

        <p className="text-sm text-green-700 font-medium">
          {product.category}
        </p>

        <h3 className="text-lg font-bold text-gray-800 mt-1">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {product.unit}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Shop: {product.shop}
        </p>

        <div className="flex items-center gap-2 mt-3">

          <span className="text-xl font-bold text-green-700">
            ₹{product.price}
          </span>

          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.oldPrice}
            </span>
          )}

        </div>

        <button
          onClick={handleAddToCart}
          className={`w-full mt-4 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition ${
            added
              ? "bg-green-900 text-white"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          <ShoppingCart size={18} />

          {added ? "Added ✓" : "Add to Cart"}
        </button>

      </div>
    </div>
  );
}

export default ProductCard;