import { createElement } from 'react';
import { CakeSlice, CalendarCheck, Heart, Leaf, Sparkles } from 'lucide-react';
import Logo from './Logo.jsx';

const benefits = [
  { label: 'Hecho\ncon amor', icon: Heart },
  { label: 'Ingredientes\nde calidad', icon: Leaf },
  { label: 'Diseños\npersonalizados', icon: Sparkles },
  { label: 'Pedidos\npor encargo', icon: CalendarCheck }
];

export default function AboutSection() {
  return (
    <section className="about-panel" id="nosotros">
      <span className="panel-heart" aria-hidden="true">♥</span>
      <div className="about__badge">
        <Logo compact />
      </div>
      <div className="about__content">
        <h2>Sobre Gali Sweets</h2>
        <p>
          En Gali Sweets creamos postres artesanales con los mejores ingredientes y mucho amor. Nos
          especializamos en pasteles personalizados, cupcakes y dulces para toda ocasión.
        </p>
        <div className="benefits">
          {benefits.map((benefit) => (
            <div className="benefit" key={benefit.label}>
              {createElement(benefit.icon, { size: 22, 'aria-hidden': true })}
              <span>{benefit.label}</span>
            </div>
          ))}
        </div>
        <a className="order-button about__button" href="#contacto">
          Conócenos más
          <CakeSlice size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
