import { Grid3X3 } from 'lucide-react';
import { products } from '../data/products.js';
import ProductCard from './ProductCard.jsx';

export default function FeaturedProducts() {
  return (
    <section className="featured section" id="menu">
      <h2 className="section-title">
        <span className="heart">♥</span> Nuestros postres destacados <span className="heart">♥</span>
      </h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
      <a className="outline-button" href="#menu">
        Ver todo el menú
        <Grid3X3 size={17} aria-hidden="true" />
      </a>
    </section>
  );
}
