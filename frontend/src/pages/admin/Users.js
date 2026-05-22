import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () => api.get("/users").then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await api.delete(`/users/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="container section">
      <h1>Users</h1>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isAdmin ? "Admin" : "User"}</td>
              <td>{!u.isAdmin && <button className="link-danger" onClick={() => del(u._id)}>Delete</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
