import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo.jsx';

const links = ['Inicio', 'Menú', 'Galería', 'Nosotros', 'Pedidos', 'Contacto'];

const anchors = {
  Inicio: '#inicio',
  Menú: '#menu',
  Galería: '#galeria',
  Nosotros: '#nosotros',
  Pedidos: '#pedidos',
  Contacto: '#contacto'
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header__inner">
        <Logo />

        <nav className={`nav ${isOpen ? 'nav--open' : ''}`} aria-label="Navegacion principal">
          {links.map((link) => (
            <a
              href={anchors[link]}
              className={link === 'Inicio' ? 'active' : ''}
              key={link}
              onClick={() => setIsOpen(false)}
            >
              {link}
            </a>
          ))}
        </nav>

        <a className="order-button header__cta" href="#pedidos">
          <ShoppingBag size={17} aria-hidden="true" />
          Haz tu pedido
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
