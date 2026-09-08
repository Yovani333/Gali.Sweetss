import PreviewImage from './PreviewImage.jsx';

export default function ProductCard({ product, onPreview }) {
  return (
    <article className="product-card">
      <PreviewImage
        src={product.image}
        thumbnail={product.thumbnail}
        thumbnailSmall={product.thumbnailSmall}
        alt={product.alt}
        onPreview={onPreview}
      />
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
    </article>
  );
}
