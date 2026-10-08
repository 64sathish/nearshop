import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  ShoppingBag,
  Truck,
  CheckCircle,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000";

function getDiscountPercent(subtotal) {
  if (subtotal >= 100000) return 20;
  if (subtotal >= 50000) return 18;
  if (subtotal >= 20000) return 15;
  if (subtotal >= 10000) return 12;
  if (subtotal >= 5000) return 10;
  if (subtotal >= 2000) return 7;
  if (subtotal >= 1000) return 5;

  return 0;
}

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    deliveryCharge,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  // ==================================================
  // GET LOGGED-IN USER
  // ==================================================

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("nearshop-user");

      if (savedUser) {
        const parsedUser =
          JSON.parse(savedUser);

        setUser(parsedUser);

        setFormData((previous) => ({
          ...previous,
          name: parsedUser.name || "",
          phone: parsedUser.phone || "",
        }));
      }
    } catch (error) {
      console.error(
        "User data error:",
        error
      );
    }
  }, []);

  // ==================================================
  // DISCOUNT
  // ==================================================

  const discountPercent = useMemo(() => {
    return getDiscountPercent(subtotal);
  }, [subtotal]);

  const discountAmount = useMemo(() => {
    return (
      subtotal *
      discountPercent /
      100
    );
  }, [
    subtotal,
    discountPercent,
  ]);

  // ==================================================
  // FINAL TOTAL
  // ==================================================

  const finalTotal =
    subtotal -
    discountAmount +
    deliveryCharge;

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================================
  // CHECK LOGIN
  // ==================================================

  const checkLogin = () => {
    const token =
      localStorage.getItem(
        "nearshop-token"
      );

    if (!token) {
      toast.error(
        "Please login before checkout."
      );

      navigate("/login");

      return false;
    }

    return true;
  };

  // ==================================================
  // VALIDATE FORM
  // ==================================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(
        "Please enter your name."
      );

      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error(
        "Please enter a valid 10 digit phone number."
      );

      return false;
    }

    if (
      !formData.address.trim()
    ) {
      toast.error(
        "Please enter your delivery address."
      );

      return false;
    }

    if (!formData.city.trim()) {
      toast.error(
        "Please enter your city."
      );

      return false;
    }

    if (
      !/^[0-9]{6}$/.test(
        formData.pincode
      )
    ) {
      toast.error(
        "Please enter a valid 6 digit pincode."
      );

      return false;
    }

    if (cartItems.length === 0) {
      toast.error(
        "Your cart is empty."
      );

      return false;
    }

    return true;
  };

  // ==================================================
  // PLACE ORDER
  // ==================================================

  const handlePlaceOrder = async () => {
    if (!checkLogin()) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const token =
      localStorage.getItem(
        "nearshop-token"
      );

    if (!token) {
      toast.error(
        "Login session expired. Please login again."
      );

      navigate("/login");

      return;
    }

    try {
      setLoading(true);

      // ================================================
      // CREATE ORDER ITEMS
      // ================================================

      const orderItems =
        cartItems.map((item) => ({
          productId:
            item.productId ||
            item._id ||
            item.id,

          name: item.name,

          price: Number(item.price),

          quantity:
            Number(item.quantity) || 1,

          unit: item.unit || "",

          shop: item.shop || "",

          image: item.image || "",
        }));

      // ================================================
      // CREATE ORDER ID
      // ================================================

      const orderId =
        `NS${Date.now()}`;

      // ================================================
      // SEND ORDER TO BACKEND
      // ================================================

      const response =
        await axios.post(
          `${API_URL}/api/orders`,
          {
            orderId,

            customerName:
              formData.name.trim(),

            phone:
              formData.phone.trim(),

            address: {
              name:
                formData.name.trim(),

              phone:
                formData.phone.trim(),

              address:
                formData.address.trim(),

              city:
                formData.city.trim(),

              pincode:
                formData.pincode.trim(),
            },

            items: orderItems,

            subtotal:
              Number(subtotal),

            discountPercent:
              Number(
                discountPercent
              ),

            discountAmount:
              Number(
                discountAmount
              ),

            deliveryCharge:
              Number(
                deliveryCharge
              ),

            total:
              Number(
                finalTotal
              ),

            paymentMethod:
              paymentMethod,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      console.log(
        "ORDER RESPONSE:",
        response.data
      );

      // ================================================
      // SUCCESS
      // ================================================

      if (
        response.data?.success !== false
      ) {
        clearCart();

        toast.success(
          "Order placed successfully!"
        );

        // Give toast a moment
        setTimeout(() => {
          navigate("/orders");
        }, 800);

        return;
      }

      toast.error(
        response.data?.message ||
          "Unable to place order."
      );
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      // ================================================
      // 401
      // ================================================

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "nearshop-token"
        );

        localStorage.removeItem(
          "nearshop-user"
        );

        toast.error(
          "Your login session expired. Please login again."
        );

        navigate("/login");

        return;
      }

      // ================================================
      // SERVER ERROR
      // ================================================

      const serverMessage =
        error.response?.data?.message;

      toast.error(
        serverMessage ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // EMPTY CART
  // ==================================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <ShoppingBag
              size={40}
              className="text-green-700"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-gray-500">
            Add some products before
            going to checkout.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            className="mt-6 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="min-h-screen bg-[#f6f8f4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your delivery details
            and place your order.
          </p>
        </div>

        {/* ==================================================
            CHECKOUT GRID
        ================================================== */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* DELIVERY ADDRESS */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                  <MapPin
                    size={22}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Address
                  </h2>

                  <p className="text-sm text-gray-500">
                    Where should we deliver
                    your order?
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your name"
                      autoComplete="name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={(event) => {
                        const value =
                          event.target.value.replace(
                            /\D/g,
                            ""
                          );

                        if (
                          value.length <=
                          10
                        ) {
                          setFormData(
                            (
                              previous
                            ) => ({
                              ...previous,
                              phone:
                                value,
                            })
                          );
                        }
                      }}
                      placeholder="10 digit mobile number"
                      autoComplete="tel"
                      maxLength={10}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                {/* ADDRESS */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House / Door No, Street, Area"
                    rows={4}
                    autoComplete="street-address"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter city"
                    autoComplete="address-level2"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* PINCODE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={
                      formData.pincode
                    }
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      if (
                        value.length <=
                        6
                      ) {
                        setFormData(
                          (
                            previous
                          ) => ({
                            ...previous,
                            pincode:
                              value,
                          })
                        );
                      }
                    }}
                    placeholder="6 digit pincode"
                    autoComplete="postal-code"
                    maxLength={6}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                  <CreditCard
                    size={22}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-gray-500">
                    Choose how you want to
                    pay.
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                {/* COD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "cod"
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    paymentMethod ===
                    "cod"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        paymentMethod ===
                        "cod"
                          ? "border-green-700"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod ===
                        "cod" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-green-700" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay when your order
                        arrives.
                      </p>
                    </div>
                  </div>

                  <Truck
                    size={22}
                    className="text-green-700"
                  />
                </button>

                {/* UPI */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "upi"
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    paymentMethod ===
                    "upi"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        paymentMethod ===
                        "upi"
                          ? "border-green-700"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod ===
                        "upi" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-green-700" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        UPI
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay using your UPI
                        application.
                      </p>
                    </div>
                  </div>

                  <CreditCard
                    size={22}
                    className="text-green-700"
                  />
                </button>
              </div>

              {paymentMethod ===
                "upi" && (
                <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                  UPI payment integration
                  can be connected later.
                  For now, the order will be
                  created with UPI selected.
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              RIGHT SIDE - ORDER SUMMARY
          ================================================== */}

          <div className="lg:col-span-1">

            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag
                    size={22}
                    className="text-green-700"
                  />

                  <h2 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  {cartItems.length}{" "}
                  {cartItems.length ===
                  1
                    ? "item"
                    : "items"}
                </span>
              </div>

              {/* PRODUCTS */}

              <div className="max-h-80 space-y-4 overflow-y-auto pr-1">

                {cartItems.map(
                  (item) => {
                    const itemId =
                      item.id ||
                      item._id ||
                      item.productId;

                    return (
                      <div
                        key={itemId}
                        className="flex gap-3 border-b border-gray-100 pb-4"
                      >
                        {/* IMAGE */}

                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          {item.image ? (
                            <img
                              src={
                                item.image.startsWith(
                                  "http"
                                )
                                  ? item.image
                                  : `${API_URL}${item.image}`
                              }
                              alt={
                                item.name
                              }
                              className="h-full w-full object-cover"
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xl">
                              🛒
                            </div>
                          )}
                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-gray-900">
                            {item.name}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            ₹
                            {Number(
                              item.price
                            ).toFixed(
                              2
                            )}{" "}
                            ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ₹
                            {(
                              Number(
                                item.price
                              ) *
                              Number(
                                item.quantity
                              )
                            ).toFixed(
                              2
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* PRICE DETAILS */}

              <div className="mt-6 space-y-3">

                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹
                    {subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>

                {/* DISCOUNT */}

                <div className="flex justify-between text-green-700">
                  <span>
                    Discount{" "}
                    {discountPercent >
                      0 &&
                      `(${discountPercent}%)`}
                  </span>

                  <span className="font-semibold">
                    - ₹
                    {discountAmount.toFixed(
                      2
                    )}
                  </span>
                </div>

                {/* DELIVERY */}

                <div className="flex justify-between text-gray-600">
                  <span>
                    Delivery
                  </span>

                  <span className="font-medium text-gray-900">
                    {deliveryCharge ===
                    0
                      ? "FREE"
                      : `₹${deliveryCharge.toFixed(
                          2
                        )}`}
                  </span>
                </div>

                <div className="my-4 border-t border-gray-200" />

                {/* TOTAL */}

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-green-700">
                    ₹
                    {finalTotal.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              {/* DISCOUNT MESSAGE */}

              {discountPercent >
                0 && (
                <div className="mt-5 rounded-xl bg-green-50 p-4">
                  <div className="flex gap-3">
                    <CheckCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-green-700"
                    />

                    <div>
                      <p className="font-semibold text-green-800">
                        You saved ₹
                        {discountAmount.toFixed(
                          2
                        )}
                      </p>

                      <p className="mt-1 text-sm text-green-700">
                        {discountPercent}%
                        discount applied
                        to your order.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* FREE DELIVERY MESSAGE */}

              {deliveryCharge ===
                0 && (
                <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                  🎉 Free delivery
                  applied!
                </div>
              )}

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={
                  handlePlaceOrder
                }
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-4 font-bold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle
                      size={20}
                    />
                    Place Order
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                By placing your order,
                you agree to NearShop's
                terms and delivery
                policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;