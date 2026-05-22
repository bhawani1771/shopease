import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span className="sep"> / </span>}
        </span>
      ))}
    </nav>
  );
}
