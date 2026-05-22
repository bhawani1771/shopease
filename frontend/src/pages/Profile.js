import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: user.name, phone: user.phone || "", address: user.address || "", password: "",
  });

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/users/profile", form);
      const updated = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="container section">
      <h1>My Profile</h1>
      <form className="auth-card" onSubmit={save}>
        <label>Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Email</label>
        <input value={user.email} disabled />
        <label>Phone</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <label>Address</label>
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <label>New Password (optional)</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn-primary full">Save Changes</button>
        <button type="button" className="btn-secondary full" onClick={logout}>Logout</button>
      </form>
    </div>
  );
}
