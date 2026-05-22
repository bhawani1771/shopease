import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    fullName: "", address: "", city: "", postalCode: "", country: "", phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const handle = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Cart is empty");
    setLoading(true);
    try {
      const body = {
        items: items.map((i) => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.image,
          price: i.product.price,
          qty: i.qty,
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };
      await api.post("/orders", body);
      clearCart();
      toast.success("Order placed!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section">
      <h1>Checkout</h1>
      <form className="checkout-grid" onSubmit={placeOrder}>
        <div className="card">
          <h3>Shipping Address</h3>
          {["fullName", "address", "city", "postalCode", "country", "phone"].map((f) => (
            <input
              key={f}
              name={f}
              required
              placeholder={f.replace(/([A-Z])/g, " $1")}
              value={address[f]}
              onChange={handle}
            />
          ))}

          <h3>Payment Method</h3>
          <label>
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            /> Cash on Delivery
          </label>
          <label>
            <input
              type="radio"
              checked={paymentMethod === "Card"}
              onChange={() => setPaymentMethod("Card")}
            /> Card (demo — no real processing)
          </label>
        </div>

        <aside className="card">
          <h3>Order Summary</h3>
          {items.map((i) => (
            <div key={i.product._id} className="row">
              <span>{i.product.name} × {i.qty}</span>
              <span>${(i.qty * i.product.price).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
          <div className="row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button className="btn-primary full" disabled={loading}>
            {loading ? "Placing..." : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
