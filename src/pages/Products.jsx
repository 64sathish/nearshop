
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
  ArrowUpDown,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000/api/products";

function Products() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [shop, setShop] = useState("all");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");

  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [likedProducts, setLikedProducts] = useState({});

  const token = localStorage.getItem("nearshop-token");

  function getLoggedInUserId() {
    try {
      const savedUser = localStorage.getItem("nearshop-user");

      if (!savedUser) {
        return null;
      }

      const user = JSON.parse(savedUser);

      return user._id || user.id || null;
    } catch {
      return null;
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category !== "all") {
        params.category = category;
      }

      if (shop !== "all") {
        params.shop = shop;
      }

      if (minPrice !== "") {
        params.minPrice = minPrice;
      }

      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }

      if (minRating !== "") {
        params.minRating = minRating;
      }

      if (maxRating !== "") {
        params.maxRating = maxRating;
      }

      if (sort) {
        params.sort = sort;
      }

      const response = await axios.get(API_URL, {
        params,
      });

      const loadedProducts = response.data.products || [];

      setProducts(loadedProducts);

      const userId = getLoggedInUserId();
      const likedState = {};

      loadedProducts.forEach((product) => {
        likedState[product._id] =
          !!userId &&
          Array.isArray(product.likedBy) &&
          product.likedBy.some(
            (id) => String(id) === String(userId)
          );
      });

      setLikedProducts(likedState);
    } catch (error) {
      console.error("LOAD PRODUCTS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Products could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [
    category,
    shop,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    sort,
  ]);

  const handleSearch = (event) => {
    event.preventDefault();
    loadProducts();
  };

  const handleLike = async (productId) => {
    if (!token) {
      toast.error("Please login to like products");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/${productId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setLikedProducts((current) => ({
        ...current,
        [productId]: data.liked,
      }));

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                likes: data.likes,
              }
            : product
        )
      );

      toast.success(
        data.liked
          ? "Product liked ❤️"
          : "Product unliked"
      );
    } catch (error) {
      console.error("LIKE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Could not update like"
      );
    }
  };

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart({
      id: product._id,
      productId: product._id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      unit: product.unit,
      shop: product.shop,
      stock: product.stock,
    });

    toast.success(`${product.name} added to cart`);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setShop("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setMaxRating("");
    setSort("");
  };

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [products]);

  const shops = useMemo(() => {
    const values = products
      .map((product) => product.shop)
      .filter(Boolean);

    return [...new Set(values)];
  }, [products]);

  const ProductCard = ({ product }) => {
    const isLiked = likedProducts[product._id];

    const image =
      product.image ||
      product.images?.[0] ||
      "https://via.placeholder.com/500x400?text=NearShop";

    const rating = Number(product.rating || 0);

    return (
      <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative bg-gray-100">
          <Link to={`/products/${product._id}`}>
            <img
              src={image}
              alt={product.name}
              className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.src =
                  "https://via.placeholder.com/500x400?text=NearShop";
              }}
            />
          </Link>

          {product.isOffer && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
              OFFER
            </span>
          )}

          <button
            type="button"
            onClick={() => handleLike(product._id)}
            className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition ${
              isLiked
                ? "text-red-600"
                : "text-gray-600 hover:text-red-600"
            }`}
            title={
              isLiked
                ? "Unlike product"
                : "Like product"
            }
          >
            <Heart
              size={21}
              fill={isLiked ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-green-700">
              {product.category}
            </span>

            <span className="text-xs text-gray-500">
              {product.shop}
            </span>
          </div>

          <Link to={`/products/${product._id}`}>
            <h2 className="line-clamp-1 text-lg font-bold text-gray-900 hover:text-green-700">
              {product.name}
            </h2>
          </Link>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-green-700 px-2 py-1 text-xs font-bold text-white">
              <Star
                size={12}
                fill="currentColor"
              />
              {rating.toFixed(1)}
            </div>

            <span className="text-xs text-gray-500">
              {product.ratingCount || 0} ratings
            </span>

            <span className="text-xs text-gray-400">
              ❤️ {product.likes || 0}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{Number(product.price || 0).toFixed(0)}
            </span>

            {product.oldPrice !== null &&
              product.oldPrice !== undefined &&
              Number(product.oldPrice) > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{Number(product.oldPrice).toFixed(0)}
                </span>
              )}

            {Number(product.discountPercent) > 0 && (
              <span className="text-xs font-bold text-green-600">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {product.unit}
          </p>

          <p
            className={`mt-2 text-sm font-medium ${
              Number(product.stock) > 0
                ? Number(product.stock) <= 5
                  ? "text-orange-600"
                  : "text-green-600"
                : "text-red-600"
            }`}
          >
            {Number(product.stock) > 0
              ? Number(product.stock) <= 5
                ? `Only ${product.stock} left`
                : "In stock"
              : "Out of stock"}
          </p>

          <div className="mt-4 flex gap-2">
            <Link
              to={`/products/${product._id}`}
              className="flex flex-1 items-center justify-center rounded-xl border border-green-700 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              View
            </Link>

            <button
              type="button"
              onClick={() => handleAddToCart(product)}
              disabled={Number(product.stock) <= 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <ShoppingCart size={17} />
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f8f4]">
      <section className="bg-green-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-sm font-medium text-green-200">
            NearShop Grocery Marketplace
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Fresh Products
          </h1>

          <p className="mt-2 max-w-2xl text-green-100">
            Shop vegetables, fruits, dairy, groceries,
            bakery items and more from nearby shops.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex max-w-3xl overflow-hidden rounded-xl bg-white shadow-lg"
          >
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search tomato, milk, rice..."
              className="min-w-0 flex-1 px-4 py-3 text-gray-900 outline-none"
            />

            <button
              type="submit"
              className="flex items-center gap-2 bg-green-700 px-5 font-semibold text-white hover:bg-green-800"
            >
              <Search size={19} />
              Search
            </button>
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-gray-900">
              {products.length} Products
            </p>

            <p className="text-sm text-gray-500">
              Find the products you need
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
            >
              <option value="">
                Sort Products
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating-high">
                Rating: High to Low
              </option>

              <option value="rating-low">
                Rating: Low to High
              </option>

              <option value="likes-high">
                Most Liked
              </option>

              <option value="newest">
                Newest
              </option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <ArrowUpDown
                size={20}
                className="text-green-700"
              />

              <h2 className="text-lg font-bold">
                Product Filters
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600"
                >
                  <option value="all">
                    All Categories
                  </option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Shop
                </label>

                <select
                  value={shop}
                  onChange={(event) =>
                    setShop(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600"
                >
                  <option value="all">
                    All Shops
                  </option>

                  {shops.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Minimum Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) =>
                    setMinPrice(event.target.value)
                  }
                  placeholder="₹ Min"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Maximum Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(event.target.value)
                  }
                  placeholder="₹ Max"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Minimum Rating
                </label>

                <select
                  value={minRating}
                  onChange={(event) =>
                    setMinRating(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none"
                >
                  <option value="">
                    Any Rating
                  </option>

                  <option value="1">1 ⭐ & above</option>
                  <option value="2">2 ⭐ & above</option>
                  <option value="3">3 ⭐ & above</option>
                  <option value="4">4 ⭐ & above</option>
                  <option value="5">5 ⭐ only</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Maximum Rating
                </label>

                <select
                  value={maxRating}
                  onChange={(event) =>
                    setMaxRating(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none"
                >
                  <option value="">
                    Any Rating
                  </option>

                  <option value="1">Up to 1 ⭐</option>
                  <option value="2">Up to 2 ⭐</option>
                  <option value="3">Up to 3 ⭐</option>
                  <option value="4">Up to 4 ⭐</option>
                  <option value="5">Up to 5 ⭐</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />

            <p className="mt-4 text-gray-500">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-20 text-center shadow-sm">
            <Search
              size={45}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;

