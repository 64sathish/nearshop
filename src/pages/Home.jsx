import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Store,
  ArrowRight,
  Leaf,
} from "lucide-react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const categories = [
  {
    name: "Vegetables",
    icon: "🥬",
    description: "Fresh vegetables",
  },
  {
    name: "Fruits",
    icon: "🍎",
    description: "Fresh fruits",
  },
  {
    name: "Dairy",
    icon: "🥛",
    description: "Milk & dairy",
  },
  {
    name: "Rice & Grains",
    icon: "🌾",
    description: "Rice & flour",
  },
  {
    name: "Bakery",
    icon: "🍞",
    description: "Fresh bakery",
  },
  {
    name: "Beverages",
    icon: "🥤",
    description: "Drinks & juices",
  },
];

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        console.log("Home products response:", response.data);

        // Make sure products is always an array
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error(
            "Products response is not an array:",
            response.data
          );

          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Home products error:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const search = searchText.trim();

    if (!search) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(search)}`
    );
  };

  const handleCategory = (category) => {
    navigate(
      `/products?category=${encodeURIComponent(category)}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f6f8f4]">

      {/* ================= HERO ================= */}

      <section className="bg-[#f6f8f4]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

          <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border border-green-100 bg-white">

            <img
              src="/NearShop-hero.png"
              alt="NearShop fresh groceries"
              className="w-full h-auto object-cover"
            />

          </div>

        </div>

      </section>

      {/* ================= BENEFITS ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 sm:py-8">

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">

            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0">
              <Truck size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Fast Delivery
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Quick local delivery
              </p>
            </div>

          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">

            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Trusted Shops
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Shop with confidence
              </p>
            </div>

          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">

            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0">
              <Store size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Local Shopping
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Support local stores
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= SEARCH ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        <div className="bg-green-900 rounded-2xl p-5 sm:p-7">

          <div className="flex items-center gap-2 text-green-200 mb-3">

            <Leaf size={18} />

            <span className="text-sm font-semibold">
              FIND YOUR GROCERIES
            </span>

          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h2 className="text-xl sm:text-2xl font-bold text-white">
                What are you looking for?
              </h2>

              <p className="text-green-200 text-sm mt-1">
                Search from fresh products available near you.
              </p>

            </div>

            <form
              onSubmit={handleSearch}
              className="bg-white rounded-xl p-1.5 flex items-center w-full md:max-w-xl shadow-lg"
            >

              <Search
                size={20}
                className="text-gray-400 ml-3 flex-shrink-0"
              />

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search tomato, rice, apple..."
                className="flex-1 min-w-0 px-3 py-3 outline-none text-gray-800 text-sm sm:text-base bg-transparent"
              />

              <button
                type="submit"
                className="bg-green-800 hover:bg-green-950 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition"
              >
                Search
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-end justify-between gap-4 mb-6">

          <div>

            <p className="text-green-700 font-bold text-sm">
              SHOP BY CATEGORY
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              What are you looking for?
            </h2>

          </div>

          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-green-700 font-semibold text-sm hover:text-green-900"
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

          {categories.map((category) => (

            <button
              key={category.name}
              onClick={() =>
                handleCategory(category.name)
              }
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
            >

              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl sm:text-3xl group-hover:bg-green-100 transition">
                {category.icon}
              </div>

              <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-4">
                {category.name}
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                {category.description}
              </p>

            </button>

          ))}

        </div>

      </section>

      {/* ================= POPULAR PRODUCTS ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

        <div className="flex items-end justify-between gap-4 mb-6">

          <div>

            <p className="text-green-700 font-bold text-sm">
              FRESH PICKS
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Popular Products
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Fresh products from nearby shops
            </p>

          </div>

          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-green-700 font-semibold text-sm hover:text-green-900"
          >
            See all
            <ArrowRight size={16} />
          </Link>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map((item) => (

              <div
                key={item}
                className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100"
              />

            ))}

          </div>

        ) : products.length === 0 ? (

          /* NO PRODUCTS */

          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">

            <div className="text-5xl">
              🛒
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-4">
              No products available
            </h3>

            <p className="text-gray-500 mt-2">
              Please add products from the shop dashboard.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-5 bg-green-800 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-900"
            >
              View Products
              <ArrowRight size={17} />
            </Link>

          </div>

        ) : (

          /* PRODUCTS */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">

            {products.slice(0, 4).map((product) => (

              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                }}
              />

            ))}

          </div>

        )}

        {/* MOBILE VIEW ALL */}

        <div className="flex justify-center sm:hidden mt-6">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-green-700 font-bold"
          >
            View all products
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>

      {/* ================= LOCAL SHOP BANNER ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="relative overflow-hidden rounded-3xl bg-green-900 text-white">

          <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-500/20 rounded-full blur-2xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 items-center">

            <div className="p-7 sm:p-10 lg:p-12">

              <div className="flex items-center gap-2 text-green-300">

                <Store size={18} />

                <p className="font-bold text-sm">
                  SUPPORT LOCAL BUSINESS
                </p>

              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-3">

                Your local shops,

                <span className="block text-green-300">
                  now on NearShop.
                </span>

              </h2>

              <p className="text-green-100 mt-4 max-w-lg text-sm sm:text-base leading-relaxed">
                Discover products from nearby stores
                and enjoy convenient local shopping
                from one place.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-6 bg-white text-green-900 px-5 py-3 rounded-xl font-bold hover:bg-green-50 transition"
              >
                Explore Shops
                <ArrowRight size={18} />
              </Link>

            </div>

            <div className="hidden md:block h-full min-h-[300px]">

              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1000&q=85"
                alt="Local grocery shop"
                className="w-full h-full object-cover"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ================= FINAL CTA ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center p-8 sm:p-12">

          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl text-2xl">
            🛒
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-4">
            Ready to shop fresh?
          </h2>

          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Find fresh groceries from trusted local
            shops and add them to your NearShop cart.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">

            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-800 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-green-900 transition"
            >
              Start Shopping
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/cart"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-green-700 text-green-800 px-6 py-3.5 rounded-xl font-bold hover:bg-green-50 transition"
            >
              <ShoppingCart size={18} />
              View Cart
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;