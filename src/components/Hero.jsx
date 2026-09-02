import { ArrowRight, ShoppingBag } from 'lucide-react';
import heroCake from '../../Catalogo Gali/Mejoradas/Pastel de 3 Camas.png';

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
          <a className="order-button hero__button" href="#pedidos">
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
      <div className="hero__image-wrap" id="galeria" aria-label="Pastel de tres capas de Gali Sweets">
        <img src={heroCake} alt="Pastel de tres capas rosa y blanco de Gali Sweets" />
      </div>
    </section>
  );
}
