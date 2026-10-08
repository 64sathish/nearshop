import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist =
      localStorage.getItem("nearshop-wishlist");

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Wishlist error:", error);
        setWishlist([]);
      }
    }
  }, []);

  const saveWishlist = (items) => {
    setWishlist(items);
    localStorage.setItem(
      "nearshop-wishlist",
      JSON.stringify(items)
    );
  };

  const removeItem = (id) => {
    const updated = wishlist.filter(
      (item) => (item._id || item.id) !== id
    );

    saveWishlist(updated);

    toast.success("Removed from wishlist.");
  };

  const addItemToCart = (product) => {
    addToCart({
      ...product,
      id: product._id || product.id,
    });

    toast.success(
      `${product.name} added to cart.`
    );
  };

  const clearWishlist = () => {
    saveWishlist([]);
    toast.success("Wishlist cleared.");
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f8f4] px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
            <Heart size={38} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Your Wishlist is Empty
          </h1>

          <p className="mt-2 text-gray-500">
            Like products you love and they will appear here.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            Browse Products
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f4] px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Wishlist ❤️
            </h1>

            <p className="mt-1 text-gray-500">
              {wishlist.length} product
              {wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          <button
            onClick={clearWishlist}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
            Clear Wishlist
          </button>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {wishlist.map((product) => {
            const id = product._id || product.id;

            return (
              <div
                key={id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="relative">

                  <Link to={`/products/${id}`}>
                    <img
                      src={
                        product.image ||
                        "https://via.placeholder.com/400x300?text=NearShop"
                      }
                      alt={product.name}
                      className="h-52 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=NearShop";
                      }}
                    />
                  </Link>

                  <button
                    onClick={() =>
                      removeItem(id)
                    }
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-md hover:bg-red-50"
                    title="Remove"
                  >
                    <Heart
                      size={20}
                      fill="currentColor"
                    />
                  </button>

                </div>

                <div className="p-4">

                  <Link
                    to={`/products/${id}`}
                  >
                    <h2 className="font-bold text-gray-900 hover:text-green-700">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-1 text-sm text-gray-500">
                    {product.unit || ""}
                  </p>

                  {product.shop && (
                    <p className="mt-1 text-xs text-gray-400">
                      {product.shop}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">

                    <p className="text-xl font-bold text-green-700">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={() =>
                        addItemToCart(product)
                      }
                      className="flex items-center gap-2 rounded-xl bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800"
                    >
                      <ShoppingCart size={17} />
                      Add
                    </button>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default Wishlist;