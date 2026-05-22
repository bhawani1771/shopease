import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error("Fill all fields");
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <div className="container section">
      <h1>Contact Us</h1>
      <form className="auth-card" onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea rows="5" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="btn-primary full">Send Message</button>
      </form>
    </div>
  );
}
