import { useEffect, useState } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => setOrders(data));
  }, []);

  if (!orders) return <Spinner />;

  return (
    <div className="container section">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Date</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(-6)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>${o.totalPrice.toFixed(2)}</td>
                <td><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
