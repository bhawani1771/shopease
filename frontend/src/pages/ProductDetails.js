import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api, { imageUrl } from "../services/api";
import Spinner from "../components/Spinner";
import Rating from "../components/Rating";
import Breadcrumb from "../components/Breadcrumb";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [rev, setRev] = useState({ rating: 5, comment: "" });

  const load = () => {
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      api
        .get(`/products?category=${encodeURIComponent(data.category)}&limit=4`)
        .then((r) => setRelated(r.data.products.filter((p) => p._id !== data._id)));
    });
  };

  useEffect(() => {
    setProduct(null);
    load();
    // remember recently viewed in localStorage
    const recent = JSON.parse(localStorage.getItem("recent") || "[]");
    const next = [id, ...recent.filter((x) => x !== id)].slice(0, 5);
    localStorage.setItem("recent", JSON.stringify(next));
    // eslint-disable-next-line
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to review");
    try {
      await api.post(`/products/${id}/reviews`, rev);
      toast.success("Review submitted");
      setRev({ rating: 5, comment: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const addWishlist = async () => {
    if (!user) return toast.error("Login required");
    try {
      await api.post(`/wishlist/${id}`);
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed");
    }
  };

  if (!product) return <Spinner />;

  return (
    <div className="container section">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/products" },
          { label: product.name },
        ]}
      />

      <div className="product-detail">
        <div className={`gallery ${zoom ? "zoomed" : ""}`} onClick={() => setZoom(!zoom)}>
          <img src={imageUrl(product.image)} alt={product.name} />
          <small>Click image to zoom</small>
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>
          <Rating value={product.rating} count={product.numReviews} />
          <p className="desc">{product.description}</p>

          <div className="price-row big">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.oldPrice > 0 && (
              <span className="old-price">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>

          <p className={product.stock > 0 ? "in-stock" : "out-stock"}>
            {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
          </p>

          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              disabled={product.stock === 0}
              onClick={async () => {
                await addToCart(product, qty);
                toast.success("Added to cart");
              }}
            >
              Add to Cart
            </button>
            <button className="btn-secondary" onClick={addWishlist}>
              ♡ Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <section className="section">
        <h2>Reviews</h2>
        {product.reviews.length === 0 && <p>No reviews yet.</p>}
        {product.reviews.map((r) => (
          <div key={r._id} className="review">
            <strong>{r.name}</strong>
            <Rating value={r.rating} />
            <p>{r.comment}</p>
          </div>
        ))}

        <form className="review-form" onSubmit={submitReview}>
          <h3>Write a review</h3>
          <select
            value={rev.rating}
            onChange={(e) => setRev({ ...rev, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
          </select>
          <textarea
            placeholder="Your comment..."
            value={rev.comment}
            onChange={(e) => setRev({ ...rev, comment: e.target.value })}
          />
          <button className="btn-primary" type="submit">Submit</button>
        </form>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="section">
          <h2>Related products</h2>
          <div className="grid">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      <p><Link to="/products">← Back to shop</Link></p>
    </div>
  );
}
