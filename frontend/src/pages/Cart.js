import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { imageUrl } from "../services/api";

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setDiscount(0.1);
      toast.success("10% discount applied!");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon");
    }
  };

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5;
  const taxable = subtotal - subtotal * discount;
  const tax = +(taxable * 0.05).toFixed(2); // 5% GST/tax
  const total = +(taxable + shipping + tax).toFixed(2);

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <h2>Your cart is empty 🛒</h2>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Your Cart</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {items.map((i) => (
            <div key={i.product._id} className="cart-row">
              <img src={imageUrl(i.product.image)} alt={i.product.name} />
              <div className="cart-name">
                <Link to={`/products/${i.product._id}`}>{i.product.name}</Link>
                <p>${i.product.price.toFixed(2)}</p>
              </div>
              <div className="qty">
                <button onClick={() => updateQty(i.product._id, i.qty - 1)}>-</button>
                <span>{i.qty}</span>
                <button onClick={() => updateQty(i.product._id, i.qty + 1)}>+</button>
              </div>
              <strong>${(i.qty * i.product.price).toFixed(2)}</strong>
              <button className="link-danger" onClick={() => removeFromCart(i.product._id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {discount > 0 && (
            <div className="row"><span>Discount</span><span>-{(discount * 100).toFixed(0)}%</span></div>
          )}
          <div className="row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
          <div className="row"><span>Tax (5%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="row total"><span>Total</span><span>${total.toFixed(2)}</span></div>

          <div className="coupon">
            <input
              placeholder="Coupon code (try SAVE10)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>

          <button className="btn-primary full" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
