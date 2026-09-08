import { X } from 'lucide-react';
import logo from '../../assets/brand/logo-primary.png';

export default function ChatHeader({ onClose }) {
  return (
    <header className="chat-header">
      <img src={logo} alt="" />
      <div>
        <strong>Gali Sweets</strong>
        <span><i aria-hidden="true" /> Haz tu pedido</span>
      </div>
      <button type="button" aria-label="Cerrar chat" title="Cerrar" onClick={onClose}>
        <X size={20} aria-hidden="true" />
      </button>
    </header>
  );
}
