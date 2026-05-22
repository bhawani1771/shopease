import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({
    name: "", description: "", price: 0, oldPrice: 0, category: "", stock: 0, isFeatured: false,
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) => setForm(data));
    }
  }, [id, isEdit]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);
    try {
      if (isEdit) await api.put(`/products/${id}`, fd);
      else await api.post("/products", fd);
      toast.success("Saved");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="container section">
      <h1>{isEdit ? "Edit" : "Add"} Product</h1>
      <form className="auth-card" onSubmit={submit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handle} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handle} />
        <input name="category" placeholder="Category" value={form.category} onChange={handle} required />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handle} required />
        <input name="oldPrice" type="number" step="0.01" placeholder="Old Price (optional)" value={form.oldPrice} onChange={handle} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handle} />
        <label>
          <input type="checkbox" name="isFeatured" checked={!!form.isFeatured} onChange={handle} /> Featured
        </label>
        <label>Product image:
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button className="btn-primary full">Save</button>
      </form>
    </div>
  );
}
