import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Skeleton from "../components/Skeleton";
import Pagination from "../components/Pagination";
import Breadcrumb from "../components/Breadcrumb";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const keyword = params.get("keyword") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "newest";
  const min = params.get("min") || "";
  const max = params.get("max") || "";
  const page = Number(params.get("page") || 1);

  useEffect(() => {
    api.get("/products/categories").then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { keyword, category, sort, min, max, page } })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [keyword, category, sort, min, max, page]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setParams(next);
  };

  return (
    <div className="container section">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Shop" }]} />
      <h1>Shop</h1>

      <div className="filters">
        <select value={category} onChange={(e) => setParam("category", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <input
          type="number"
          placeholder="Min $"
          value={min}
          onChange={(e) => setParam("min", e.target.value)}
        />
        <input
          type="number"
          placeholder="Max $"
          value={max}
          onChange={(e) => setParam("max", e.target.value)}
        />

        <select value={sort} onChange={(e) => setParam("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <Skeleton />
      ) : data.products.length === 0 ? (
        <p className="empty">No products found.</p>
      ) : (
        <>
          <div className="grid">
            {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <Pagination
            page={data.page}
            pages={data.pages}
            onChange={(n) => setParam("page", String(n))}
          />
        </>
      )}
    </div>
  );
}
