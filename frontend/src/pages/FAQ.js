import { useState } from "react";

const faqs = [
  { q: "How long does shipping take?", a: "Most orders arrive in 3–5 business days." },
  { q: "Can I return an item?", a: "Yes, within 30 days of delivery." },
  { q: "Do you offer Cash on Delivery?", a: "Yes, COD is available at checkout." },
  { q: "How do I track my order?", a: "Go to My Orders in your profile menu." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="container section">
      <h1>FAQ</h1>
      {faqs.map((f, i) => (
        <div key={i} className="faq-item">
          <button onClick={() => setOpen(open === i ? null : i)}>
            {f.q} <span>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
