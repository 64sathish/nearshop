import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  ArrowRight,
  Search,
  Truck,
  ShieldCheck,
  Clock,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [likedProducts, setLikedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("nearshop-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        // IMPORTANT:
        // Backend returns:
        // {
        //   success: true,
        //   count: 14,
        //   products: [...]
        // }
        //
        // So we must store only response.data.products
        // inside the products state.

        const productList = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.products)
          ? response.data.products
          : [];

        setProducts(productList);
      } catch (error) {
        console.error("Home products error:", error);

        setProducts([]);

        toast.error(
          error.response?.data?.message ||
            "Unable to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =========================================================
  // SAVE WISHLIST
  // =========================================================
  useEffect(() => {
    localStorage.setItem(
      "nearshop-wishlist",
      JSON.stringify(likedProducts)
    );
  }, [likedProducts]);

  // =========================================================
  // LIKE PRODUCT
  // =========================================================
  const handleLike = async (product) => {
    const token = localStorage.getItem("nearshop-token");

    if (!token) {
      toast.error("Please login to like products");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${product._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProduct = response.data.product;

      if (updatedProduct) {
        setProducts((currentProducts) =>
          currentProducts.map((item) =>
            item._id === updatedProduct._id
              ? updatedProduct
              : item
          )
        );
      }

      setLikedProducts((current) => {
        if (current.includes(product._id)) {
          return current.filter((id) => id !== product._id);
        }

        return [...current, product._id];
      });

      toast.success(
        likedProducts.includes(product._id)
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (error) {
      console.error("Like error:", error);

      // Fallback local wishlist
      setLikedProducts((current) => {
        if (current.includes(product._id)) {
          return current.filter((id) => id !== product._id);
        }

        return [...current, product._id];
      });

      toast.success(
        likedProducts.includes(product._id)
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    }
  };

  // =========================================================
  // ADD TO CART
  // =========================================================
  const handleAddToCart = (product) => {
    if (!product) return;

    if (
      product.stock !== undefined &&
      Number(product.stock) <= 0
    ) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart({
      id: product._id || product.id,
      _id: product._id,
      name: product.name,
      price: Number(product.price) || 0,
      oldPrice: Number(product.oldPrice) || 0,
      image: product.image,
      images: product.images || [],
      unit: product.unit,
      shop: product.shop,
      quantity: 1,
    });

    toast.success(`${product.name} added to cart`);
  };

  // =========================================================
  // PRODUCT IMAGE
  // =========================================================
  const getProductImage = (product) => {
    if (!product) {
      return "/NearShop-hero.png";
    }

    if (product.image) {
      if (
        product.image.startsWith("http://") ||
        product.image.startsWith("https://") ||
        product.image.startsWith("/")
      ) {
        return product.image;
      }

      return `http://localhost:5000/${product.image}`;
    }

    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const image = product.images[0];

      if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("/")
      ) {
        return image;
      }

      return `http://localhost:5000/${image}`;
    }

    return "/NearShop-hero.png";
  };

  // =========================================================
  // DISPLAY PRODUCTS
  // =========================================================
  const featuredProducts = Array.isArray(products)
    ? products.slice(0, 8)
    : [];

  const offerProducts = Array.isArray(products)
    ? products
        .filter(
          (product) =>
            product.isOffer === true ||
            Number(product.discountPercent) > 0 ||
            Number(product.oldPrice) > Number(product.price)
        )
        .slice(0, 8)
    : [];

  const popularProducts = Array.isArray(products)
    ? [...products]
        .sort(
          (a, b) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        )
        .slice(0, 8)
    : [];

  // =========================================================
  // CATEGORY DATA
  // =========================================================
  const categories = [
    {
      name: "Vegetables",
      emoji: "🥕",
    },
    {
      name: "Fruits",
      emoji: "🍎",
    },
    {
      name: "Dairy",
      emoji: "🥛",
    },
    {
      name: "Rice & Grains",
      emoji: "🌾",
    },
    {
      name: "Bakery",
      emoji: "🍞",
    },
    {
      name: "Beverages",
      emoji: "🥤",
    },
  ];

  // =========================================================
  // PRODUCT CARD
  // =========================================================
  const ProductCard = ({ product }) => {
    const productId = product._id || product.id;

    const isLiked = likedProducts.includes(productId);

    const oldPrice = Number(product.oldPrice || 0);
    const currentPrice = Number(product.price || 0);

    let discount = Number(product.discountPercent || 0);

    if (
      discount === 0 &&
      oldPrice > currentPrice &&
      oldPrice > 0
    ) {
      discount = Math.round(
        ((oldPrice - currentPrice) / oldPrice) * 100
      );
    }

    const rating = Number(product.rating || 0);

    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
        {/* IMAGE */}
        <div className="relative bg-gray-50 h-52 overflow-hidden">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(event) => {
              event.currentTarget.src =
                "/NearShop-hero.png";
            }}
          />

          {/* DISCOUNT */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}

          {/* LIKE */}
          <button
            type="button"
            onClick={() => handleLike(product)}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
          >
            <Heart
              size={20}
              className={
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }
            />
          </button>

          {/* OFFER */}
          {product.isOffer && (
            <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Special Offer
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">
            {product.category}
          </div>

          <Link
            to={`/products/${productId}`}
            className="block"
          >
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1 hover:text-green-700">
              {product.name}
            </h3>
          </Link>

          {/* RATING */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  className={
                    star <= Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <span className="text-xs text-gray-500">
              {rating > 0 ? rating.toFixed(1) : "No rating"}
            </span>

            {product.ratingCount > 0 && (
              <span className="text-xs text-gray-400">
                ({product.ratingCount})
              </span>
            )}
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl font-bold text-green-700">
              ₹{currentPrice.toFixed(0)}
            </span>

            {oldPrice > currentPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{oldPrice.toFixed(0)}
              </span>
            )}
          </div>

          {/* UNIT */}
          {product.unit && (
            <div className="text-xs text-gray-500 mt-1">
              {product.unit}
            </div>
          )}

          {/* SHOP */}
          {product.shop && (
            <div className="text-xs text-gray-500 mt-2">
              Shop: {product.shop}
            </div>
          )}

          {/* STOCK */}
          <div className="mt-2">
            {Number(product.stock || 0) > 0 ? (
              <span
                className={
                  Number(product.stock) <=
                  Number(product.lowStockLimit || 5)
                    ? "text-xs text-orange-600 font-semibold"
                    : "text-xs text-green-600 font-semibold"
                }
              >
                {Number(product.stock) <=
                Number(product.lowStockLimit || 5)
                  ? `Only ${product.stock} left`
                  : "In Stock"}
              </span>
            ) : (
              <span className="text-xs text-red-600 font-semibold">
                Out of Stock
              </span>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 mt-4">
            <Link
              to={`/products/${productId}`}
              className="flex-1 border border-green-700 text-green-700 rounded-xl py-2.5 text-center font-semibold hover:bg-green-50 transition"
            >
              View
            </Link>

            <button
              type="button"
              onClick={() => handleAddToCart(product)}
              disabled={Number(product.stock || 0) <= 0}
              className="flex-1 bg-green-700 text-white rounded-xl py-2.5 font-semibold flex items-center justify-center gap-2 hover:bg-green-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={17} />
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================
  // HOME PAGE
  // =========================================================
  return (
    <div className="min-h-screen bg-[#f6f8f4]">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="bg-gradient-to-r from-green-950 via-green-900 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
                <Tag size={16} />
                Fresh groceries at your doorstep
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Your Local Shops,
                <span className="text-green-300">
                  {" "}
                  One NearShop
                </span>
              </h1>

              <p className="mt-5 text-green-100 text-lg max-w-xl leading-7">
                Shop fresh vegetables, fruits, dairy,
                groceries and everyday essentials from
                your trusted local shops.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/products"
                  className="bg-white text-green-900 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition flex items-center gap-2"
                >
                  Shop Now
                  <ArrowRight size={19} />
                </Link>

                <Link
                  to="/products?sort=discount"
                  className="border border-white/40 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition"
                >
                  View Offers
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-300/20 blur-3xl rounded-full" />

                <img
                  src="/NearShop-hero.png"
                  alt="NearShop groceries"
                  className="relative w-[480px] h-[360px] object-cover rounded-3xl shadow-2xl border border-white/10"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BENEFITS
      ====================================================== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <Truck size={21} />
              </div>

              <div>
                <div className="font-bold">
                  Fast Delivery
                </div>
                <div className="text-xs text-gray-500">
                  Local delivery
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <ShieldCheck size={21} />
              </div>

              <div>
                <div className="font-bold">
                  Trusted Shops
                </div>
                <div className="text-xs text-gray-500">
                  Quality products
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <Clock size={21} />
              </div>

              <div>
                <div className="font-bold">
                  Easy Shopping
                </div>
                <div className="text-xs text-gray-500">
                  Simple ordering
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <Tag size={21} />
              </div>

              <div>
                <div className="font-bold">
                  Great Offers
                </div>
                <div className="text-xs text-gray-500">
                  Save more
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-7">
          <div>
            <p className="text-green-700 font-semibold text-sm">
              SHOP BY CATEGORY
            </p>

            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              Browse Categories
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 text-green-700 font-semibold hover:text-green-900"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(
                category.name
              )}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="text-4xl mb-3">
                {category.emoji}
              </div>

              <div className="font-bold text-gray-800">
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          SPECIAL OFFERS
      ====================================================== */}
      {offerProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-red-600 font-semibold text-sm">
                LIMITED TIME
              </p>

              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                Special Offers
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 text-green-700 font-semibold"
            >
              View All
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading products...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {offerProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-green-700 font-semibold text-sm">
                NEARSHOP PICKS
              </p>

              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 text-green-700 font-semibold"
            >
              View All
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading products...
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search
                size={45}
                className="mx-auto text-gray-300 mb-3"
              />

              <h3 className="font-bold text-xl text-gray-700">
                No products found
              </h3>

              <p className="text-gray-500 mt-1">
                Products will appear here when available.
              </p>

              <Link
                to="/products"
                className="inline-block mt-5 bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          POPULAR PRODUCTS
      ====================================================== */}
      {popularProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-green-700 font-semibold text-sm">
                CUSTOMER FAVOURITES
              </p>

              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                Popular Products
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 text-green-700 font-semibold"
            >
              Explore More
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          DISCOUNT BANNER
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-3xl bg-green-900 text-white p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-green-300 font-semibold mb-2">
                NEARSHOP SAVINGS
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold">
                Shop more, save more!
              </h2>

              <p className="text-green-100 mt-3 max-w-xl">
                Enjoy special discounts on qualifying
                purchases and discover great offers from
                your local shops.
              </p>
            </div>

            <Link
              to="/products"
              className="shrink-0 bg-white text-green-900 px-7 py-3 rounded-xl font-bold hover:bg-green-50 transition flex items-center gap-2"
            >
              Start Shopping
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;