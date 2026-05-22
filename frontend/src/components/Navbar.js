import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/products?keyword=${encodeURIComponent(search)}`);
    setOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          🛍️ ShopEase
        </Link>

        <form className="search" onSubmit={onSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>Shop</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>

          <Link to="/wishlist" className="icon-btn" onClick={() => setOpen(false)}>♡</Link>
          <Link to="/cart" className="icon-btn cart-btn" onClick={() => setOpen(false)}>
            🛒 {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </Link>

          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <div className="dropdown">
              <button className="btn-ghost" onClick={() => setShowMenu(!showMenu)}>
                Hi, {user.name.split(" ")[0]} ▾
              </button>
              {showMenu && (
                <div className="dropdown-menu" onClick={() => setShowMenu(false)}>
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/wishlist">Wishlist</Link>
                  {user.isAdmin && <Link to="/admin">Admin</Link>}
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </nav>

        <button className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
    </header>
  );
}
