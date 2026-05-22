import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Skeleton from "../components/Skeleton";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products/featured"),
      api.get("/products?sort=newest&limit=8"),
      api.get("/products/categories"),
    ])
      .then(([f, l, c]) => {
        setFeatured(f.data);
        setLatest(l.data.products);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>Shop the latest, the smartest, the best.</h1>
            <p>Hand-picked products, fair prices, and fast delivery to your door.</p>
            <Link to="/products" className="btn-primary lg">Shop Now</Link>
          </div>
          <div className="hero-art">🛍️</div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section container">
        <h2>Shop by Category</h2>
        <div className="categories">
          {categories.map((c) => (
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="cat-card">
              <span>{c}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="section container">
        <h2>Featured Products</h2>
        {loading ? <Skeleton count={4} /> : (
          <div className="grid">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* SALE BANNER */}
      <section className="container">
        <div className="sale-banner">
          <div>
            <h2>Mega Sale — up to 40% off</h2>
            <p>Limited time only. Grab your favorites before they're gone.</p>
          </div>
          <Link to="/products?sort=price-asc" className="btn-secondary">View Deals</Link>
        </div>
      </section>

      {/* LATEST */}
      <section className="section container">
        <h2>Latest Products</h2>
        {loading ? <Skeleton /> : (
          <div className="grid">
            {latest.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="section container">
        <h2>What our customers say</h2>
        <div className="testimonials">
          {[
            { name: "Aarav", text: "Super fast delivery and great products!" },
            { name: "Priya", text: "Loved the packaging and quality. Will buy again." },
            { name: "Rahul", text: "Best prices I've found online. Highly recommend!" },
          ].map((t) => (
            <div key={t.name} className="testimonial">
              <p>“{t.text}”</p>
              <strong>— {t.name}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
