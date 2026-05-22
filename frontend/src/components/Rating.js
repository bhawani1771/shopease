// Simple star rating display.
export default function Rating({ value = 0, count = 0 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="rating" title={`${value.toFixed(1)} / 5`}>
      {stars.map((s) => (
        <span key={s} className={s <= Math.round(value) ? "star filled" : "star"}>
          ★
        </span>
      ))}
      {count > 0 && <span className="rating-count">({count})</span>}
    </div>
  );
}
