import { testimonials } from '../data/testimonials.js';

export default function Testimonials() {
  return (
    <section className="testimonials-panel">
      <span className="panel-heart" aria-hidden="true">♥</span>
      <h2>Lo que dicen nuestros clientes</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <span className="quote-mark" aria-hidden="true">“</span>
            <p>{testimonial.quote}</p>
            <div className="stars" aria-label="5 estrellas">★★★★★</div>
            <strong>{testimonial.name}</strong>
          </article>
        ))}
      </div>
      <div className="carousel-dots" aria-label="Indicadores de carrusel">
        <span className="active" />
        <span />
        <span />
      </div>
    </section>
  );
}
