import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get("/orders").then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success("Updated");
    load();
  };

  return (
    <div className="container section">
      <h1>Orders</h1>
      <table className="table">
        <thead><tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o._id.slice(-6)}</td>
              <td>{o.user?.name}</td>
              <td>${o.totalPrice.toFixed(2)}</td>
              <td>
                <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
