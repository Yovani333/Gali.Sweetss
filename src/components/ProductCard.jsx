export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.alt} />
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
    </article>
  );
}
