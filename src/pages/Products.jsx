import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ProductCard from "../components/ProductCard";

const categories = [
  {
    name: "All",
    icon: "🛍️",
  },
  {
    name: "Vegetables",
    icon: "🥬",
  },
  {
    name: "Fruits",
    icon: "🍎",
  },
  {
    name: "Dairy",
    icon: "🥛",
  },
  {
    name: "Rice & Grains",
    icon: "🌾",
  },
  {
    name: "Bakery",
    icon: "🍞",
  },
  {
    name: "Beverages",
    icon: "🥤",
  },
];

function Products() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedCategory =
    searchParams.get("category") || "All";

  const searchText =
    searchParams.get("search") || "";

  const [inputText, setInputText] =
    useState(searchText);

  // --------------------------------------------------
  // GET PRODUCTS
  // --------------------------------------------------

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(response.data);
      } catch (error) {
        console.error(
          "Products loading error:",
          error
        );

        setError(
          "Unable to load products. Please check that the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --------------------------------------------------
  // UPDATE INPUT WHEN URL SEARCH CHANGES
  // --------------------------------------------------

  useEffect(() => {
    setInputText(searchText);
  }, [searchText]);

  // --------------------------------------------------
  // CATEGORY FILTER
  // --------------------------------------------------

  const handleCategory = (category) => {
    const params = new URLSearchParams();

    if (category !== "All") {
      params.set("category", category);
    }

    if (searchText.trim()) {
      params.set("search", searchText.trim());
    }

    setSearchParams(params);
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (selectedCategory !== "All") {
      params.set(
        "category",
        selectedCategory
      );
    }

    if (inputText.trim()) {
      params.set(
        "search",
        inputText.trim()
      );
    }

    setSearchParams(params);
  };

  // --------------------------------------------------
  // CLEAR SEARCH
  // --------------------------------------------------

  const clearSearch = () => {
    const params = new URLSearchParams();

    if (selectedCategory !== "All") {
      params.set(
        "category",
        selectedCategory
      );
    }

    setSearchParams(params);
    setInputText("");
  };

  // --------------------------------------------------
  // FILTER PRODUCTS
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    return products.filter((product) => {

      // Category
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      // Search
      const matchesSearch =
        !search ||
        product.name
          ?.toLowerCase()
          .includes(search) ||
        product.category
          ?.toLowerCase()
          .includes(search) ||
        product.shop
          ?.toLowerCase()
          .includes(search) ||
        product.description
          ?.toLowerCase()
          .includes(search);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    products,
    selectedCategory,
    searchText,
  ]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f4] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-green-200 border-t-green-800 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-green-800 font-bold">
            Loading fresh products...
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Please wait
          </p>

        </div>

      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f8f4] flex items-center justify-center px-4">

        <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-8 text-center max-w-lg w-full">

          <div className="text-6xl">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Products could not be loaded
          </h2>

          <p className="text-red-600 mt-3">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-xl font-bold"
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#f6f8f4]">

      {/* ================= HEADER ================= */}

      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          <div className="max-w-3xl">

            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm">
              🛒 Fresh groceries near you
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-5 leading-tight">
              Shop Fresh Products
            </h1>

            <p className="text-green-100 mt-3 text-sm sm:text-base max-w-2xl">
              Find fresh vegetables, fruits,
              dairy, rice, bakery items and
              beverages from nearby shops.
            </p>

          </div>

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="mt-8 max-w-3xl"
          >

            <div className="bg-white rounded-2xl p-2 flex items-center shadow-xl">

              <Search
                size={21}
                className="text-gray-400 ml-3 flex-shrink-0"
              />

              <input
                type="text"
                value={inputText}
                onChange={(event) =>
                  setInputText(
                    event.target.value
                  )
                }
                placeholder="Search tomato, rice, apple..."
                className="w-full px-3 py-3 outline-none text-gray-800 bg-transparent text-sm sm:text-base"
              />

              {inputText && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-700 p-2"
                >
                  <X size={18} />
                </button>
              )}

              <button
                type="submit"
                className="bg-green-800 hover:bg-green-950 text-white px-5 sm:px-7 py-3 rounded-xl font-bold transition"
              >
                Search
              </button>

            </div>

          </form>

        </div>

      </section>

      {/* ================= MAIN ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* CATEGORY TITLE */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <div>

            <p className="text-green-700 font-bold text-sm">
              SHOP BY CATEGORY
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Choose what you need
            </h2>

          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">

            <SlidersHorizontal size={17} />

            <span>
              {filteredProducts.length} products
            </span>

          </div>

        </div>

        {/* ================= CATEGORY BUTTONS ================= */}

        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">

          {categories.map((category) => {

            const active =
              selectedCategory ===
              category.name;

            return (
              <button
                key={category.name}
                onClick={() =>
                  handleCategory(
                    category.name
                  )
                }
                className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border ${
                  active
                    ? "bg-green-800 text-white border-green-800 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-800"
                }`}
              >

                <span className="text-lg">
                  {category.icon}
                </span>

                {category.name}

              </button>
            );
          })}

        </div>

        {/* ================= CURRENT FILTER ================= */}

        <div className="mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">

              {selectedCategory === "All"
                ? "All Products"
                : selectedCategory}

            </h2>

            <p className="text-gray-500 mt-1 text-sm">

              {searchText
                ? `Search results for "${searchText}"`
                : selectedCategory === "All"
                ? "Fresh products from nearby shops"
                : `Fresh ${selectedCategory.toLowerCase()} from nearby shops`}

            </p>

          </div>

          {(selectedCategory !== "All" ||
            searchText) && (
            <button
              onClick={() => {
                setSearchParams({});
                setInputText("");
              }}
              className="text-green-700 font-semibold text-sm hover:text-green-900"
            >
              Clear filters
            </button>
          )}

        </div>

        {/* ================= PRODUCTS ================= */}

        <div className="mt-6">

          {filteredProducts.length === 0 ? (

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-5 text-center">

              <div className="text-6xl">
                🛒
              </div>

              <h3 className="text-xl font-bold text-gray-800 mt-4">
                No products found
              </h3>

              <p className="text-gray-500 mt-2">
                Try another category or search.
              </p>

              <button
                onClick={() => {
                  setSearchParams({});
                  setInputText("");
                }}
                className="mt-5 bg-green-800 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-900"
              >
                Show all products
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">

              {filteredProducts.map(
                (product) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      ...product,
                      id: product._id,
                    }}
                  />
                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* ================= BOTTOM BANNER ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

        <div className="rounded-2xl bg-green-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <p className="text-green-300 font-semibold text-sm">
              NEARSHOP
            </p>

            <h3 className="text-xl sm:text-2xl font-bold mt-1">
              Fresh groceries from local shops
            </h3>

            <p className="text-green-100 text-sm mt-2">
              Shop local. Save more. Get fresh.
            </p>

          </div>

          <div className="text-4xl sm:text-5xl">
            🥬 🍎 🥛 🌾
          </div>

        </div>

      </section>

    </main>
  );
}

export default Products;