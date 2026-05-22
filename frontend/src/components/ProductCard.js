import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { imageUrl } from "../services/api";
import Rating from "./Rating";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = async () => {
    await addToCart(product, 1);
    toast.success("Added to cart");
  };

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-img">
          <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
          {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <Rating value={product.rating} count={product.numReviews} />
          <div className="price-row">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.oldPrice > 0 && (
              <span className="old-price">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
      <button className="btn-primary full" onClick={handleAdd}>
        Add to Cart
      </button>
    </div>
  );
}
