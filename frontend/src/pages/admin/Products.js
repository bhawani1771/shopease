import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api, { imageUrl } from "../../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const load = () => api.get("/products?limit=100").then((r) => setProducts(r.data.products));
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="container section">
      <div className="flex-between">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>
      <table className="table">
        <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={imageUrl(p.image)} alt="" width="50" /></td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>
                <Link to={`/admin/products/${p._id}/edit`}>Edit</Link>{" "}
                <button className="link-danger" onClick={() => del(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
