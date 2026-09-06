import { Check, Pencil, X } from 'lucide-react';
import { businessConfig } from '../../config/business.js';
import { createOrderWhatsAppUrl, formatPrice, formatRequestedDate } from './chatUtils.js';

export default function OrderSummary({ order, product, onEdit, onCancel }) {
  const delivery = businessConfig.deliveryMethods.find((method) => method.id === order.deliveryMethod)?.label || 'Por definir';
  return (
    <div className="order-summary">
      <h3>Resumen de solicitud</h3>
      <dl>
        <div><dt>Producto</dt><dd>{product?.name || 'Por definir'}</dd></div>
        {order.variant && <div><dt>Variante</dt><dd>{order.variant}</dd></div>}
        <div><dt>Cantidad</dt><dd>{order.quantity}</dd></div>
        <div><dt>Fecha solicitada</dt><dd>{formatRequestedDate(order.requestedDate)}</dd></div>
        <div><dt>Hora aproximada</dt><dd>{order.requestedTime || 'Por definir'}</dd></div>
        <div><dt>Modalidad</dt><dd>{delivery}</dd></div>
        {order.deliveryAddress && <div><dt>Zona o referencia</dt><dd>{order.deliveryAddress}</dd></div>}
        <div><dt>Nombre</dt><dd>{order.customerName}</dd></div>
        <div><dt>Notas</dt><dd>{order.notes || 'Sin indicaciones especiales'}</dd></div>
        <div className="order-summary__total"><dt>Total estimado</dt><dd>{formatPrice(product, order.quantity)}</dd></div>
      </dl>
      <p className="chat-notice">Este pedido todavía no está confirmado. La disponibilidad, horario y precio final serán confirmados por WhatsApp.</p>
      <a className="chat-primary chat-primary--whatsapp" href={createOrderWhatsAppUrl(order, product)} target="_blank" rel="noreferrer">
        <Check size={17} /> Enviar solicitud por WhatsApp
      </a>
      <button className="chat-secondary" type="button" onClick={onEdit}><Pencil size={16} /> Editar pedido</button>
      <button className="chat-text-button" type="button" onClick={onCancel}><X size={15} /> Cancelar</button>
    </div>
  );
}
