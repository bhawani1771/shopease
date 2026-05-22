import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Fill all fields");
    if (form.password.length < 6) return toast.error("Password must be 6+ chars");
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="container section auth-page">
      <form onSubmit={onSubmit} className="auth-card">
        <h2>Create Account</h2>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div className="pw-wrap">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
        </div>
        <input
          type={show ? "text" : "password"}
          placeholder="Confirm password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <button className="btn-primary full" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
