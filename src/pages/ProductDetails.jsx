import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Trash2,
  User,
  MapPin,
  Store,
  Package,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const [liked, setLiked] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // =========================================================
  // GET PRODUCT
  // =========================================================
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        const productData =
          response.data?.product || response.data;

        if (!productData) {
          toast.error("Product not found");
          navigate("/products");
          return;
        }

        setProduct(productData);

        setSelectedImage(
          productData.image ||
            productData.images?.[0] ||
            ""
        );

        const token = localStorage.getItem(
          "nearshop-token"
        );

        if (token && productData.likedBy) {
          const userData = JSON.parse(
            localStorage.getItem("nearshop-user") || "null"
          );

          const userId =
            userData?._id || userData?.id;

          if (
            userId &&
            productData.likedBy.some(
              (user) =>
                String(user?._id || user) ===
                String(userId)
            )
          ) {
            setLiked(true);
          }
        }
      } catch (error) {
        console.error(
          "Product details error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Unable to load product"
        );

        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  // =========================================================
  // IMAGE URL
  // =========================================================
  const getImageUrl = (image) => {
    if (!image) {
      return "/NearShop-hero.png";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("/")
    ) {
      return image;
    }

    return `http://localhost:5000/${image}`;
  };

  // =========================================================
  // ALL PRODUCT IMAGES
  // =========================================================
  const productImages = product
    ? [
        ...(product.image ? [product.image] : []),
        ...(Array.isArray(product.images)
          ? product.images
          : []),
      ].filter(
        (image, index, array) =>
          image && array.indexOf(image) === index
      )
    : [];

  // =========================================================
  // DISCOUNT
  // =========================================================
  const currentPrice = Number(
    product?.price || 0
  );

  const oldPrice = Number(
    product?.oldPrice || 0
  );

  let discount = Number(
    product?.discountPercent || 0
  );

  if (
    discount === 0 &&
    oldPrice > currentPrice &&
    oldPrice > 0
  ) {
    discount = Math.round(
      ((oldPrice - currentPrice) / oldPrice) * 100
    );
  }

  // =========================================================
  // STOCK
  // =========================================================
  const stock = Number(product?.stock || 0);

  const maxQuantity =
    stock > 0 ? Math.min(stock, 20) : 0;

  // =========================================================
  // CHANGE QUANTITY
  // =========================================================
  const increaseQuantity = () => {
    if (quantity >= maxQuantity) {
      toast.error(
        `Only ${maxQuantity} items available`
      );
      return;
    }

    setQuantity((value) => value + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((value) =>
      value > 1 ? value - 1 : 1
    );
  };

  // =========================================================
  // LIKE PRODUCT
  // =========================================================
  const handleLike = async () => {
    const token = localStorage.getItem(
      "nearshop-token"
    );

    if (!token) {
      toast.error("Please login to like this product");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProduct =
        response.data?.product;

      if (updatedProduct) {
        setProduct(updatedProduct);
      }

      setLiked((value) => !value);

      toast.success(
        liked
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (error) {
      console.error("Like error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update like"
      );
    }
  };

  // =========================================================
  // ADD TO CART
  // =========================================================
  const handleAddToCart = () => {
    if (!product) return;

    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        _id: product._id,
        name: product.name,
        price: currentPrice,
        oldPrice: oldPrice,
        image: product.image,
        images: product.images || [],
        unit: product.unit,
        shop: product.shop,
        quantity: 1,
      });
    }

    toast.success(
      `${quantity} ${product.name} added to cart`
    );
  };

  // =========================================================
  // BUY NOW
  // =========================================================
  const handleBuyNow = () => {
    if (!product) return;

    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        _id: product._id,
        name: product.name,
        price: currentPrice,
        oldPrice: oldPrice,
        image: product.image,
        images: product.images || [],
        unit: product.unit,
        shop: product.shop,
        quantity: 1,
      });
    }

    navigate("/checkout");
  };

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================
  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem(
      "nearshop-token"
    );

    if (!token) {
      toast.error("Please login to write a review");
      navigate("/login");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please enter your review");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        {
          rating: Number(reviewRating),
          comment: reviewComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProduct =
        response.data?.product;

      if (updatedProduct) {
        setProduct(updatedProduct);
      }

      setReviewComment("");
      setReviewRating(5);

      toast.success("Review submitted successfully");
    } catch (error) {
      console.error("Review error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to submit review"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================
  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem(
      "nearshop-token"
    );

    if (!token) {
      toast.error("Please login");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/products/${id}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProduct =
        response.data?.product;

      if (updatedProduct) {
        setProduct(updatedProduct);
      }

      toast.success("Review deleted");
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete review"
      );
    }
  };

  // =========================================================
  // CHECK CURRENT USER
  // =========================================================
  const currentUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("nearshop-user") ||
          "null"
      );
    } catch {
      return null;
    }
  })();

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PRODUCT NOT FOUND
  // =========================================================
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f6f8f4] flex items-center justify-center px-4">
        <div className="text-center">
          <Package
            size={60}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-bold mt-4">
            Product not found
          </h2>

          <Link
            to="/products"
            className="inline-block mt-5 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================
  return (
    <div className="min-h-screen bg-[#f6f8f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-semibold mb-6"
        >
          <ArrowLeft size={19} />
          Back
        </button>

        {/* =====================================================
            PRODUCT SECTION
        ====================================================== */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-5 sm:p-8">
            {/* =================================================
                IMAGE SECTION
            ================================================== */}
            <div>
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden h-[420px]">
                <img
                  src={getImageUrl(
                    selectedImage ||
                      product.image ||
                      product.images?.[0]
                  )}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(event) => {
                    event.currentTarget.src =
                      "/NearShop-hero.png";
                  }}
                />

                {discount > 0 && (
                  <div className="absolute top-5 left-5 bg-red-500 text-white font-bold px-4 py-2 rounded-full">
                    {discount}% OFF
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLike}
                  className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
                >
                  <Heart
                    size={25}
                    className={
                      liked
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }
                  />
                </button>
              </div>

              {/* THUMBNAILS */}
              {productImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {productImages.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(image)
                        }
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${
                          selectedImage === image
                            ? "border-green-600"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`${product.name} ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover"
                          onError={(event) => {
                            event.currentTarget.src =
                              "/NearShop-hero.png";
                          }}
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                DETAILS
            ================================================== */}
            <div>
              <div className="text-sm text-green-700 font-semibold">
                {product.category}
              </div>

              {product.subCategory && (
                <div className="text-xs text-gray-500 mt-1">
                  {product.subCategory}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                {product.name}
              </h1>

              {/* RATING */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={19}
                        className={
                          star <=
                          Math.round(
                            Number(
                              product.rating || 0
                            )
                          )
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    )
                  )}
                </div>

                <span className="font-semibold">
                  {Number(product.rating || 0).toFixed(
                    1
                  )}
                </span>

                <span className="text-gray-500">
                  {product.ratingCount || 0} reviews
                </span>

                <span className="text-gray-300">
                  |
                </span>

                <span className="text-gray-600">
                  {product.likes || 0} likes
                </span>
              </div>

              {/* PRICE */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <span className="text-4xl font-extrabold text-green-700">
                  ₹{currentPrice.toFixed(0)}
                </span>

                {oldPrice > currentPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{oldPrice.toFixed(0)}
                    </span>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      Save ₹
                      {(
                        oldPrice - currentPrice
                      ).toFixed(0)}
                    </span>
                  </>
                )}
              </div>

              {product.unit && (
                <div className="text-gray-500 mt-2">
                  Price for {product.unit}
                </div>
              )}

              {/* OFFER */}
              {product.isOffer && (
                <div className="mt-5 bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="font-bold text-green-800">
                    {product.offerTitle ||
                      "Special Offer"}
                  </div>

                  {product.offerDescription && (
                    <p className="text-sm text-green-700 mt-1">
                      {product.offerDescription}
                    </p>
                  )}
                </div>
              )}

              {/* DESCRIPTION */}
              {product.description && (
                <div className="mt-6">
                  <h3 className="font-bold text-lg">
                    Description
                  </h3>

                  <p className="text-gray-600 leading-7 mt-2">
                    {product.description}
                  </p>
                </div>
              )}

              {/* SHOP */}
              <div className="mt-6 border-t pt-5">
                <div className="flex items-start gap-3">
                  <Store
                    size={22}
                    className="text-green-700 mt-1"
                  />

                  <div>
                    <div className="font-bold">
                      {product.shop ||
                        "NearShop Store"}
                    </div>

                    {product.shopLocation && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin size={14} />
                        {product.shopLocation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* STOCK */}
              <div className="mt-5">
                {stock > 0 ? (
                  <div className="text-green-700 font-semibold">
                    ✓ In Stock
                    {stock <=
                      Number(
                        product.lowStockLimit || 5
                      ) && (
                      <span className="text-orange-600 ml-2">
                        Only {stock} left
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-red-600 font-bold">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* QUANTITY */}
              {stock > 0 && (
                <div className="mt-6">
                  <div className="font-semibold mb-2">
                    Quantity
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        className="w-11 h-11 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={18} />
                      </button>

                      <div className="w-14 text-center font-bold">
                        {quantity}
                      </div>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        className="w-11 h-11 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <span className="text-sm text-gray-500">
                      Maximum {maxQuantity}
                    </span>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="grid sm:grid-cols-2 gap-3 mt-7">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  className="bg-white border-2 border-green-700 text-green-700 rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-100"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={stock <= 0}
                  className="bg-green-700 text-white rounded-xl py-3.5 font-bold hover:bg-green-800 transition disabled:bg-gray-300"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            REVIEWS
        ====================================================== */}
        <div className="grid lg:grid-cols-3 gap-7 mt-8">
          {/* REVIEW SUMMARY */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 h-fit">
            <h2 className="text-2xl font-extrabold">
              Customer Reviews
            </h2>

            <div className="flex items-center gap-4 mt-6">
              <div className="text-5xl font-extrabold text-gray-900">
                {Number(
                  product.rating || 0
                ).toFixed(1)}
              </div>

              <div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <=
                          Math.round(
                            Number(
                              product.rating || 0
                            )
                          )
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    )
                  )}
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  Based on{" "}
                  {product.ratingCount || 0} reviews
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map(
                (rating) => {
                  const reviews =
                    product.reviews || [];

                  const count = reviews.filter(
                    (review) =>
                      Number(review.rating) ===
                      rating
                  ).length;

                  const total = reviews.length;

                  const percentage =
                    total > 0
                      ? (count / total) * 100
                      : 0;

                  return (
                    <div
                      key={rating}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm w-8">
                        {rating}★
                      </span>

                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <span className="text-xs text-gray-500 w-6 text-right">
                        {count}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* WRITE REVIEW + REVIEWS */}
          <div className="lg:col-span-2 space-y-6">
            {/* WRITE REVIEW */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold">
                Write a Review
              </h3>

              <form
                onSubmit={handleReviewSubmit}
                className="mt-5"
              >
                <div>
                  <label className="block font-semibold mb-2">
                    Your Rating
                  </label>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewRating(star)
                          }
                          className="p-1"
                        >
                          <Star
                            size={27}
                            className={
                              star <= reviewRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block font-semibold mb-2">
                    Your Review
                  </label>

                  <textarea
                    value={reviewComment}
                    onChange={(event) =>
                      setReviewComment(
                        event.target.value
                      )
                    }
                    rows={4}
                    maxLength={500}
                    placeholder="Share your experience with this product..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />

                  <div className="text-right text-xs text-gray-400 mt-1">
                    {reviewComment.length}/500
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 disabled:bg-gray-400"
                >
                  {submittingReview
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </form>
            </div>

            {/* REVIEWS LIST */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold mb-5">
                Reviews
              </h3>

              {!product.reviews ||
              product.reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star
                    size={40}
                    className="mx-auto text-gray-300 mb-3"
                  />

                  <p>
                    No reviews yet. Be the first to
                    review this product!
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {product.reviews
                    .slice()
                    .reverse()
                    .map((review) => {
                      const reviewUserId =
                        review.userId?._id ||
                        review.userId;

                      const currentUserId =
                        currentUser?._id ||
                        currentUser?.id;

                      const isOwnReview =
                        reviewUserId &&
                        currentUserId &&
                        String(reviewUserId) ===
                          String(currentUserId);

                      return (
                        <div
                          key={review._id}
                          className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                                <User size={19} />
                              </div>

                              <div>
                                <div className="font-bold">
                                  {review.userName ||
                                    "Customer"}
                                </div>

                                <div className="text-xs text-gray-400">
                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt
                                      ).toLocaleDateString()
                                    : ""}
                                </div>
                              </div>
                            </div>

                            {isOwnReview && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteReview(
                                    review._id
                                  )
                                }
                                className="text-red-500 hover:text-red-700"
                                title="Delete review"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>

                          <div className="flex mt-3">
                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  className={
                                    star <=
                                    Number(
                                      review.rating
                                    )
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              )
                            )}
                          </div>

                          {review.comment && (
                            <p className="text-gray-600 mt-3 leading-6">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;