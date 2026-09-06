import { ArrowRight, ShoppingBag } from 'lucide-react';
import BakeryScene from './BakeryScene.jsx';

const avatarColors = ['#8d5c4f', '#f5a6b8', '#6f4a3f', '#e7c0ad', '#4b3939'];

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__copy">
        <p className="eyebrow">♥ BIENVENIDOS A GALI SWEETS ♥</p>
        <h1>
          <span>Sabores exquisitos y</span>
          <span>dulces tentaciones</span>
        </h1>
        <p className="hero__description">
          Postres artesanales hechos con amor, perfectos para cada ocasión. Personalizados a tu gusto y
          disponibles <strong>por pedido.</strong>
        </p>
        <div className="hero__actions">
          <a className="order-button hero__button" href="#pedidos" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event('gali:open-chat')); }}>
            <ShoppingBag size={17} aria-hidden="true" />
            Haz tu pedido
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <div className="happy-clients" aria-label="+250 clientes felices">
            <div className="avatars">
              {avatarColors.map((color, index) => (
                <span key={color} style={{ '--avatar-color': color }} aria-hidden="true">
                  {index + 1}
                </span>
              ))}
            </div>
            <span>+250 clientes felices</span>
          </div>
        </div>
      </div>
      <BakeryScene />
    </section>
  );
}
