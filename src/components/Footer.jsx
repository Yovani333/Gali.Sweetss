import { Clock, Instagram, Mail, MessageCircle } from 'lucide-react';
import Logo from './Logo.jsx';

function CupcakeIcon() {
  return (
    <svg className="footer-cupcake" viewBox="0 0 88 106" aria-hidden="true">
      <path d="M44 10c6-12 22-9 22 5 0 15-22 25-22 25S22 30 22 15c0-14 16-17 22-5Z" />
      <path d="M22 42c-10 2-16 11-14 21 9-2 20 1 26 8 7-8 21-9 29-2 4-7 11-10 18-8 2-11-5-19-15-20-4-12-18-17-29-10-7 2-12 6-15 11Z" />
      <path d="M20 67h49l-8 31H29L20 67Z" />
      <path d="M29 74l4 20M44 72v24M59 74l-4 20" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="wave" aria-hidden="true" />
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>Sabores exquisitos y dulces tentaciones.</p>
        </div>
        <div className="footer__col">
          <h3>Síguenos en Instagram</h3>
          <p>
            <Instagram size={21} aria-hidden="true" />
            @gali.sweetss
          </p>
        </div>
        <div className="footer__col">
          <h3>Contáctanos</h3>
          <p>
            <MessageCircle size={18} aria-hidden="true" />
            +57 300 123 4567
          </p>
          <p>
            <Mail size={18} aria-hidden="true" />
            galisweets.pedidos@gmail.com
          </p>
        </div>
        <div className="footer__col" id="pedidos">
          <h3>Pedidos</h3>
          <p>
            <Clock size={18} aria-hidden="true" />
            Lun - Sáb: 9:00 a.m. - 7:00 p.m.
          </p>
          <p>Por pedido con al menos 24h de anticipación.</p>
        </div>
        <CupcakeIcon />
      </div>
      <p className="copyright">© 2024 Gali Sweets. Todos los derechos reservados.</p>
    </footer>
  );
}
