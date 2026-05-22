import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! 🎉");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>🛍️ ShopEase</h3>
          <p>Your favorite shopping destination. Quality products, fair prices.</p>
        </div>

        <div>
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Fashion">Fashion</Link>
          <Link to="/products?category=Home">Home</Link>
        </div>

        <div>
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div>
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        <div>
          <h4>Newsletter</h4>
          <form onSubmit={subscribe} className="newsletter">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="container copyright">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
}
