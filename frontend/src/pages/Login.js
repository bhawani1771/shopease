import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Fill all fields");
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container section auth-page">
      <form onSubmit={onSubmit} className="auth-card">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="pw-wrap">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
        </div>
        <button className="btn-primary full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
