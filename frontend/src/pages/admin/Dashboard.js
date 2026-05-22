import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, products: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/orders/stats"),
      api.get("/products?limit=1"),
      api.get("/users"),
    ]).then(([s, p, u]) => {
      setStats({
        totalOrders: s.data.totalOrders,
        revenue: s.data.revenue,
        products: p.data.total,
        users: u.data.length,
      });
    });
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
    { label: "Products", value: stats.products },
    { label: "Users", value: stats.users },
  ];

  return (
    <div className="container section">
      <h1>Admin Dashboard</h1>
      <div className="stats">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <span>{c.label}</span>
            <strong>{c.value}</strong>
          </div>
        ))}
      </div>

      <div className="admin-links">
        <Link to="/admin/products" className="btn-primary">Manage Products</Link>
        <Link to="/admin/orders" className="btn-secondary">Manage Orders</Link>
        <Link to="/admin/users" className="btn-secondary">Manage Users</Link>
      </div>
    </div>
  );
}
