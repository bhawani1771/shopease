import { useState } from "react";
import toast from "react-hot-toast";

// UI-only — wire up real email reset later (e.g. Nodemailer).
export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    toast.success("If that email exists, a reset link has been sent.");
    setEmail("");
  };

  return (
    <div className="container section auth-page">
      <form onSubmit={submit} className="auth-card">
        <h2>Forgot Password</h2>
        <p>Enter your account email and we'll send you reset instructions.</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-primary full">Send Reset Link</button>
      </form>
    </div>
  );
}
