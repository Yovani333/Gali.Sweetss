import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, Clock3, CreditCard, HelpCircle, Home, MessageCircle, PackageSearch, RotateCcw, ShoppingBag, Tags, Truck } from 'lucide-react';
import { products } from '../../data/products.js';
import { businessConfig, directWhatsAppUrl } from '../../config/business.js';
import ChatHeader from './ChatHeader.jsx';
import ChatMessages from './ChatMessages.jsx';
import QuickReplies from './QuickReplies.jsx';
import ProductOptions from './ProductOptions.jsx';
import OrderFlow from './OrderFlow.jsx';
import useChatSession from './useChatSession.js';
import { emptyOrder } from './chatUtils.js';
import './chat-widget.css';

const orderScreens = new Set(['order-product', 'order-quantity', 'order-date', 'order-time', 'order-delivery', 'order-address', 'order-name', 'order-notes', 'order-summary', 'order-edit']);

export default function ChatWidget({ onPreview }) {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const launcher = useRef(null);
  const { session, setSession, typing, transition, updateOrder, back, menu, reset } = useChatSession();

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener('gali:open-chat', openChat);
    return () => window.removeEventListener('gali:open-chat', openChat);
  }, []);

  useEffect(() => {
    if (open) panel.current?.focus();
    else launcher.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !document.querySelector('.image-viewer[open]')) setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const startOrder = (mode, productId = '') => {
    const first = mode === 'schedule' ? 'order-date' : productId ? 'order-quantity' : 'order-product';
    transition({
      next: first,
      user: mode === 'schedule' ? 'Programar pedido' : 'Hacer un pedido',
      bot: mode === 'schedule' ? '¿Para qué fecha lo necesitas?' : productId ? '¿Cuántos deseas?' : '¿Qué deseas ordenar?',
      patch: { flowMode: mode, editing: false, order: { ...session.order, ...(productId ? { productId } : {}) } },
    });
  };

  const chooseFromCatalog = (product) => startOrder('order', product.id);
  const show = (next, user, bot) => transition({ next, user, bot });
  const cancelOrder = () => setSession((current) => ({
    ...current,
    screen: 'menu',
    stack: [],
    editing: false,
    order: { ...emptyOrder },
    messages: [...current.messages, { id: crypto.randomUUID(), role: 'user', text: 'Cancelar solicitud' }, { id: crypto.randomUUID(), role: 'bot', text: 'La solicitud fue cancelada. ¿En qué más podemos ayudarte?' }],
  }));

  const menuOptions = [
    { id: 'prices', label: 'Ver precios', icon: Tags, onClick: () => show('prices', 'Ver precios', 'Estos son nuestros productos. Los precios se cotizan según el diseño y la personalización.') },
    { id: 'products', label: 'Ver productos', icon: PackageSearch, onClick: () => show('products', 'Ver productos', 'Explora nuestros diseños y elige el que más te guste.') },
    { id: 'order', label: 'Hacer un pedido', icon: ShoppingBag, onClick: () => startOrder('order') },
    { id: 'schedule', label: 'Programar pedido', icon: CalendarDays, onClick: () => startOrder('schedule') },
    { id: 'delivery', label: 'Entrega y recolección', icon: Truck, onClick: () => show('delivery-info', 'Entrega y recolección', 'Estas son las opciones para recibir tu pedido.') },
    { id: 'payment', label: 'Métodos de pago', icon: CreditCard, onClick: () => show('payment-info', 'Métodos de pago', 'Los métodos de pago disponibles se confirman por WhatsApp al revisar tu solicitud.') },
    { id: 'hours', label: 'Horarios', icon: Clock3, onClick: () => show('hours-info', 'Horarios', businessConfig.schedule.label) },
    { id: 'whatsapp', label: 'Hablar por WhatsApp', icon: MessageCircle, href: directWhatsAppUrl },
  ];

  let controls = null;
  if (session.screen === 'menu') controls = <QuickReplies options={menuOptions} />;
  if (session.screen === 'prices' || session.screen === 'products') controls = <ProductOptions products={products} mode={session.screen} onPreview={onPreview} onChoose={chooseFromCatalog} />;
  if (session.screen === 'delivery-info') controls = <div className="chat-info-list">{businessConfig.deliveryMethods.map((method) => <article key={method.id}><strong>{method.label}</strong><p>{method.note}</p></article>)}</div>;
  if (session.screen === 'payment-info') controls = <div className="chat-info-card"><CreditCard size={20} /><p>No hay métodos de pago publicados. Se confirmarán directamente por WhatsApp.</p></div>;
  if (session.screen === 'hours-info') controls = <div className="chat-info-card"><Clock3 size={20} /><p>{businessConfig.schedule.label}</p><small>Pedidos con al menos {businessConfig.minimumNoticeHours} horas de anticipación.</small></div>;
  if (orderScreens.has(session.screen)) controls = <OrderFlow screen={session.screen} session={session} products={products} transition={transition} updateOrder={updateOrder} onPreview={onPreview} onCancel={cancelOrder} />;

  return (
    <div className={`chat-widget ${open ? 'chat-widget--open' : ''}`}>
      <section ref={panel} className="chat-panel" role="dialog" aria-modal="false" aria-label="Atención y pedidos de Gali Sweets" tabIndex="-1" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}>
        <ChatHeader onClose={() => setOpen(false)} />
        <ChatMessages messages={session.messages} typing={typing}>{controls}</ChatMessages>
        <footer className="chat-footer">
          {session.screen !== 'menu' && <button type="button" onClick={back}><ChevronLeft size={15} /> Atrás</button>}
          {session.screen !== 'menu' && <button type="button" onClick={menu}><Home size={15} /> Menú principal</button>}
          <button type="button" onClick={reset}><RotateCcw size={14} /> Empezar de nuevo</button>
        </footer>
      </section>
      {!open && <span className="chat-launcher__hint">¿Necesitas ayuda?</span>}
      {!open && <button ref={launcher} className="chat-launcher" type="button" aria-label="Abrir asistente de pedidos" aria-expanded="false" onClick={() => setOpen(true)}>
        <HelpCircle size={24} /><span className="chat-launcher__dot" />
      </button>}
    </div>
  );
}
