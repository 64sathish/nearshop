
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ArrowRight,
  Truck,
  ShieldCheck,
  Clock,
  MapPin,
} from "lucide-react";

function Home() {
  const categories = [
    {
      name: "Vegetables",
      emoji: "🥦",
      color: "bg-green-100",
    },
    {
      name: "Fruits",
      emoji: "🍎",
      color: "bg-red-100",
    },
    {
      name: "Dairy",
      emoji: "🥛",
      color: "bg-blue-100",
    },
    {
      name: "Rice & Grains",
      emoji: "🌾",
      color: "bg-yellow-100",
    },
    {
      name: "Bakery",
      emoji: "🍞",
      color: "bg-orange-100",
    },
    {
      name: "Beverages",
      emoji: "🥤",
      color: "bg-purple-100",
    },
  ];

  const popularProducts = [
    {
      name: "Fresh Tomato",
      category: "Vegetables",
      price: 40,
      oldPrice: 50,
      unit: "1 kg",
      image:
        "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Fresh Potato",
      category: "Vegetables",
      price: 45,
      oldPrice: 55,
      unit: "1 kg",
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Fresh Apple",
      category: "Fruits",
      price: 140,
      oldPrice: 170,
      unit: "1 kg",
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Fresh Banana",
      category: "Fruits",
      price: 60,
      oldPrice: 75,
      unit: "1 dozen",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="bg-[#f8faf7] min-h-screen">

      {/* ========================================= */}
      {/* HERO SECTION */}
      {/* ========================================= */}

      <section className="bg-green-900 text-white">

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT SIDE */}

            <div>

              <div className="inline-flex items-center gap-2 bg-green-800 px-4 py-2 rounded-full mb-6">
                <MapPin size={17} />

                <span className="text-sm">
                  Fresh groceries near you
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">

                Fresh groceries.

                <br />

                <span className="text-green-300">
                  Local shops.
                </span>

                <br />

                Delivered to you.
              </h1>

              <p className="text-green-100 text-lg mt-6 max-w-xl leading-8">
                Shop fresh vegetables, fruits, dairy products,
                groceries and more from trusted local shops
                around you.
              </p>

              {/* SEARCH */}

              <div className="bg-white rounded-xl p-2 flex items-center mt-8 max-w-xl shadow-lg">

                <Search
                  size={22}
                  className="text-gray-400 ml-3"
                />

                <input
                  type="text"
                  placeholder="Search for vegetables, fruits, groceries..."
                  className="flex-1 px-3 py-3 outline-none text-gray-700"
                />

                <Link
                  to="/products"
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Search
                </Link>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-4 mt-7">

                <Link
                  to="/products"
                  className="bg-white text-green-900 hover:bg-green-100 px-6 py-3 rounded-lg font-bold flex items-center gap-2"
                >
                  Shop Now

                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/cart"
                  className="border border-green-400 hover:bg-green-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                  <ShoppingCart size={18} />

                  View Cart
                </Link>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="relative">

              <div className="bg-green-800 rounded-3xl p-6">

                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh groceries"
                  className="w-full h-[420px] object-cover rounded-2xl"
                />

              </div>

              {/* FLOATING CARD */}

              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white text-gray-800 rounded-xl shadow-xl p-4 flex items-center gap-4">

                <div className="bg-green-100 p-3 rounded-full">
                  <Truck
                    size={25}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <p className="font-bold">
                    Fast Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    From nearby shops
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* BENEFITS */}
      {/* ========================================= */}

      <section className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="flex items-center gap-4">

              <div className="bg-green-100 p-3 rounded-full">
                <Truck
                  className="text-green-700"
                  size={24}
                />
              </div>

              <div>
                <h3 className="font-bold">
                  Fast Delivery
                </h3>

                <p className="text-sm text-gray-500">
                  Quick local delivery
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="bg-green-100 p-3 rounded-full">
                <ShieldCheck
                  className="text-green-700"
                  size={24}
                />
              </div>

              <div>
                <h3 className="font-bold">
                  Trusted Shops
                </h3>

                <p className="text-sm text-gray-500">
                  Verified local sellers
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="bg-green-100 p-3 rounded-full">
                <Clock
                  className="text-green-700"
                  size={24}
                />
              </div>

              <div>
                <h3 className="font-bold">
                  Fresh Products
                </h3>

                <p className="text-sm text-gray-500">
                  Fresh groceries every day
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="bg-green-100 p-3 rounded-full">
                <MapPin
                  className="text-green-700"
                  size={24}
                />
              </div>

              <div>
                <h3 className="font-bold">
                  Local Shops
                </h3>

                <p className="text-sm text-gray-500">
                  Shops near your location
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* CATEGORIES */}
      {/* ========================================= */}

      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="flex items-end justify-between mb-8">

          <div>

            <p className="text-green-700 font-semibold">
              Browse categories
            </p>

            <h2 className="text-3xl font-bold text-green-950 mt-1">
              Shop by Category
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

          {categories.map((category) => (

            <Link
              to="/products"
              key={category.name}
              className={`${category.color} rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-md transition`}
            >

              <div className="text-5xl mb-4">
                {category.emoji}
              </div>

              <h3 className="font-bold text-gray-800">
                {category.name}
              </h3>

            </Link>

          ))}

        </div>

      </section>

      {/* ========================================= */}
      {/* POPULAR PRODUCTS */}
      {/* ========================================= */}

      <section className="bg-white py-14">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-end justify-between mb-8">

            <div>

              <p className="text-green-700 font-semibold">
                Fresh picks for you
              </p>

              <h2 className="text-3xl font-bold text-green-950 mt-1">
                Popular Products
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {popularProducts.map((product) => (

              <div
                key={product.name}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition"
              >

                {/* IMAGE */}

                <div className="h-52 bg-green-50 overflow-hidden">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />

                </div>

                {/* DETAILS */}

                <div className="p-5">

                  <p className="text-sm text-green-700 font-medium">
                    {product.category}
                  </p>

                  <h3 className="text-lg font-bold text-gray-800 mt-1">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {product.unit}
                  </p>

                  <div className="flex items-center gap-2 mt-4">

                    <span className="text-xl font-bold text-green-700">
                      ₹{product.price}
                    </span>

                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.oldPrice}
                    </span>

                  </div>

                  <Link
                    to="/products"
                    className="block text-center bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg mt-4"
                  >
                    Shop Now
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* LOCAL SHOP BANNER */}
      {/* ========================================= */}

      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="bg-green-900 rounded-3xl overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

            <div className="p-8 md:p-12 text-white">

              <p className="text-green-300 font-semibold mb-3">
                SUPPORT LOCAL
              </p>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Your neighborhood shops,
                <br />
                now online.
              </h2>

              <p className="text-green-100 mt-5 leading-7 max-w-lg">
                Discover products from nearby grocery stores
                and support local businesses while getting
                your daily essentials delivered to your door.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-green-900 px-6 py-3 rounded-lg font-bold mt-7 hover:bg-green-100"
              >
                Explore Local Shops

                <ArrowRight size={18} />
              </Link>

            </div>

            <div className="h-72 lg:h-full">

              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1000&q=80"
                alt="Local grocery shop"
                className="w-full h-full object-cover"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* CALL TO ACTION */}
      {/* ========================================= */}

      <section className="bg-green-50 py-16">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <div className="text-5xl mb-5">
            🛒
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-green-950">
            Ready to shop fresh?
          </h2>

          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Find your favorite groceries from trusted
            local shops and get them delivered to your home.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-7 py-3 rounded-lg font-bold mt-7"
          >
            Start Shopping

            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;

