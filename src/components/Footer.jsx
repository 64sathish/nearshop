function Footer() {
  return (
    <footer className="bg-green-950 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold mb-4">
            NearShop
          </h2>

          <p className="text-gray-300">
            Your local grocery marketplace.
            Buy fresh products from nearby shops.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-300">
            <li>Home</li>
            <li>Products</li>
            <li>Deals</li>
            <li>Cart</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">
            Customer
          </h3>

          <ul className="space-y-2 text-gray-300">
            <li>My Orders</li>
            <li>Track Order</li>
            <li>Account</li>
            <li>Help</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">
            Contact
          </h3>

          <p className="text-gray-300">
            Email: support@nearshop.com
          </p>

          <p className="text-gray-300 mt-2">
            Phone: +91 98765 43210
          </p>
        </div>

      </div>

      <div className="border-t border-green-800 text-center py-5 text-gray-300">
        © 2026 NearShop. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;