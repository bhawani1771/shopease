import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

export default function Wishlist() {
  const [items, setItems] = useState(null);

  const load = () => api.get("/wishlist").then(({ data }) => setItems(data.products));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await api.delete(`/wishlist/${id}`);
    toast.success("Removed");
    load();
  };

  if (!items) return <Spinner />;

  return (
    <div className="container section">
      <h1>My Wishlist</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid">
          {items.map((p) => (
            <div key={p._id}>
              <ProductCard product={p} />
              <button className="link-danger" onClick={() => remove(p._id)}>
                Remove from wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
