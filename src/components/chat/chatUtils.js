import { businessConfig, createWhatsAppUrl } from '../../config/business.js';

export const CHAT_STORAGE_KEY = 'gali-sweets-chat-session-v1';

export const emptyOrder = {
  productId: '',
  variant: '',
  quantity: 1,
  requestedDate: '',
  requestedTime: '',
  deliveryMethod: '',
  deliveryAddress: '',
  customerName: '',
  notes: '',
};

export function cleanText(value, maxLength = 180) {
  const printable = [...value].map((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127 ? ' ' : character;
  }).join('');
  return printable.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function earliestOrderDate() {
  const date = new Date();
  date.setHours(date.getHours() + businessConfig.minimumNoticeHours);
  while (businessConfig.schedule.closedWeekdays.includes(date.getDay())) date.setDate(date.getDate() + 1);
  return localDateString(date);
}

export function isOrderDateAllowed(value) {
  if (!value || value < earliestOrderDate()) return false;
  const [year, month, day] = value.split('-').map(Number);
  return !businessConfig.schedule.closedWeekdays.includes(new Date(year, month - 1, day).getDay());
}

export function formatRequestedDate(value) {
  if (!value) return 'Por definir';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, day));
}

export function formatPrice(product, quantity = 1) {
  if (!Number.isFinite(product?.price)) return 'Precio por confirmar';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.price * quantity);
}

export function buildOrderMessage(order, product) {
  const method = businessConfig.deliveryMethods.find((item) => item.id === order.deliveryMethod)?.label || 'Por definir';
  const lines = [
    'Hola 👋',
    '',
    'Quiero solicitar el siguiente pedido:',
    '',
    `🛍️ Producto: ${product?.name || 'Por definir'}`,
    order.variant ? `📏 Variante: ${order.variant}` : null,
    `🔢 Cantidad: ${order.quantity}`,
    `📅 Fecha solicitada: ${formatRequestedDate(order.requestedDate)}`,
    `🕐 Hora aproximada: ${order.requestedTime || 'Por definir'}`,
    `📍 Modalidad: ${method}`,
    order.deliveryAddress ? `🚗 Zona o referencia: ${cleanText(order.deliveryAddress, 160)}` : null,
    `👤 Nombre: ${cleanText(order.customerName, 80)}`,
    order.notes ? `📝 Notas: ${cleanText(order.notes, 240)}` : '📝 Notas: Sin indicaciones especiales',
    '',
    `💰 Total estimado: ${formatPrice(product, order.quantity)}`,
    '',
    'Entiendo que esta solicitud está sujeta a confirmación de disponibilidad, horario y precio final.',
    '',
    '¿Me pueden confirmar si es posible realizarlo?',
  ];
  return lines.filter((line) => line !== null).join('\n');
}

export function createOrderWhatsAppUrl(order, product) {
  return createWhatsAppUrl(buildOrderMessage(order, product));
}
