// Skeleton placeholder used while products are loading.
export default function Skeleton({ count = 8 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product-card skeleton-card">
          <div className="skeleton skeleton-img" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  );
}
