import { Eye, ShoppingBag } from 'lucide-react';
import { formatPrice } from './chatUtils.js';

export default function ProductOptions({ products, mode, onChoose, onPreview }) {
  const preview = (event, product) => {
    const img = event.currentTarget.closest('.chat-product').querySelector('img');
    onPreview({ src: product.image, alt: product.alt, width: img.naturalWidth, height: img.naturalHeight });
  };
  return (
    <div className="chat-products">
      {products.map((product) => (
        <article className="chat-product" key={product.id}>
          <button type="button" className="chat-product__image" aria-label={`Ver ${product.name}`} onClick={(event) => preview(event, product)}>
            <img src={product.image} alt="" />
          </button>
          <div className="chat-product__copy">
            <strong>{product.name}</strong>
            {mode === 'products' && <p>{product.description.replace('\n', ' ')}</p>}
            <span>{formatPrice(product)}</span>
          </div>
          <div className="chat-product__buttons">
            <button type="button" aria-label={`Ver imagen de ${product.name}`} title="Ver producto" onClick={(event) => preview(event, product)}><Eye size={16} /></button>
            <button type="button" aria-label={`Elegir ${product.name}`} title="Elegir" onClick={() => onChoose(product)}><ShoppingBag size={16} /></button>
          </div>
        </article>
      ))}
    </div>
  );
}
