import { MapPin, Truck } from 'lucide-react';
import { businessConfig } from '../../config/business.js';
import ProductOptions from './ProductOptions.jsx';
import QuantitySelector from './QuantitySelector.jsx';
import DateSelector from './DateSelector.jsx';
import TextStep from './TextStep.jsx';
import QuickReplies from './QuickReplies.jsx';
import OrderSummary from './OrderSummary.jsx';
import { formatRequestedDate } from './chatUtils.js';

const times = Array.from({ length: businessConfig.schedule.closes - businessConfig.schedule.opens + 1 }, (_, index) => {
  const hour = businessConfig.schedule.opens + index;
  const value = hour > 12 ? hour - 12 : hour;
  return `${value}:00 ${hour >= 12 ? 'p.m.' : 'a.m.'}`;
});

export default function OrderFlow({ screen, session, products, transition, updateOrder, onPreview, onCancel }) {
  const { order, editing, flowMode } = session;
  const product = products.find((item) => item.id === order.productId);
  const save = (values, label, normalNext, bot) => {
    updateOrder(values);
    transition({ next: editing ? 'order-summary' : normalNext, user: label, bot: editing ? 'Actualicé tu solicitud.' : bot });
  };

  if (screen === 'order-product') return <ProductOptions products={products} mode="products" onPreview={onPreview} onChoose={(item) => save({ productId: item.id, variant: '' }, item.name, 'order-quantity', '¿Cuántos deseas?')} />;
  if (screen === 'order-quantity') return <QuantitySelector initialValue={order.quantity} onSubmit={(quantity) => save({ quantity }, `${quantity}`, flowMode === 'schedule' && order.requestedDate ? 'order-time' : 'order-date', flowMode === 'schedule' && order.requestedDate ? '¿A qué hora aproximadamente lo necesitas?' : '¿Para qué fecha lo necesitas?')} />;
  if (screen === 'order-date') return <DateSelector initialValue={order.requestedDate} onSubmit={(requestedDate) => save({ requestedDate }, formatRequestedDate(requestedDate), flowMode === 'schedule' && !order.productId ? 'order-product' : 'order-time', flowMode === 'schedule' && !order.productId ? '¿Qué deseas ordenar?' : '¿A qué hora aproximadamente lo necesitas?')} />;
  if (screen === 'order-time') return (
    <form className="chat-form" onSubmit={(event) => {
      event.preventDefault();
      const requestedTime = new FormData(event.currentTarget).get('time');
      if (requestedTime) save({ requestedTime }, requestedTime, 'order-delivery', '¿Cómo deseas recibir tu pedido?');
    }}>
      <label htmlFor="chat-time">Hora aproximada</label>
      <select id="chat-time" name="time" defaultValue={order.requestedTime} required>
        <option value="" disabled>Selecciona una hora</option>
        {times.map((time) => <option value={time} key={time}>{time}</option>)}
      </select>
      <small>Dentro de nuestro horario: {businessConfig.schedule.label}</small>
      <button className="chat-primary" type="submit">Continuar</button>
    </form>
  );
  if (screen === 'order-delivery') return <QuickReplies options={businessConfig.deliveryMethods.map((method) => ({
    id: method.id,
    label: method.label,
    icon: method.id === 'delivery' ? Truck : MapPin,
    onClick: () => {
      const values = { deliveryMethod: method.id, ...(method.id === 'pickup' ? { deliveryAddress: '' } : {}) };
      if (editing && method.id === 'delivery') {
        updateOrder(values);
        transition({ next: 'order-address', user: method.label, bot: '¿En qué colonia o zona sería la entrega?' });
      } else {
        save(values, method.label, method.id === 'delivery' ? 'order-address' : 'order-name', method.id === 'delivery' ? '¿En qué colonia o zona sería la entrega?' : '¿A nombre de quién hacemos la solicitud?');
      }
    },
  }))} />;
  if (screen === 'order-address') return <TextStep id="chat-address" label="Colonia, zona o referencia" optional initialValue={order.deliveryAddress} maxLength={160} placeholder="Puedes dejarlo vacío" onSubmit={(deliveryAddress) => save({ deliveryAddress }, deliveryAddress || 'Sin zona indicada', editing ? 'order-summary' : 'order-name', editing ? 'Actualicé tu solicitud.' : '¿A nombre de quién hacemos la solicitud?')} />;
  if (screen === 'order-name') return <TextStep id="chat-name" label="Nombre" initialValue={order.customerName} maxLength={80} placeholder="Tu nombre" onSubmit={(customerName) => save({ customerName }, customerName, 'order-notes', '¿Quieres agregar alguna indicación especial?')} />;
  if (screen === 'order-notes') return <TextStep id="chat-notes" label="Indicaciones especiales" optional multiline initialValue={order.notes} maxLength={240} placeholder="Personalización, dedicatoria, color..." onSubmit={(notes) => save({ notes }, notes || 'Sin indicaciones especiales', 'order-summary', 'Revisa los datos antes de enviar tu solicitud.')} />;
  if (screen === 'order-summary') return <OrderSummary order={order} product={product} onCancel={onCancel} onEdit={() => transition({ next: 'order-edit', user: 'Editar pedido', bot: '¿Qué dato deseas modificar?', patch: { editing: true } })} />;
  if (screen === 'order-edit') {
    const edit = (next, label) => transition({ next, user: label, bot: `Modifica: ${label.toLowerCase()}.` });
    return <QuickReplies options={[
      ['product', 'Producto', 'order-product'], ['quantity', 'Cantidad', 'order-quantity'], ['date', 'Fecha', 'order-date'], ['time', 'Hora', 'order-time'], ['delivery', 'Entrega', 'order-delivery'], ...(order.deliveryMethod === 'delivery' ? [['address', 'Zona de entrega', 'order-address']] : []), ['name', 'Nombre', 'order-name'], ['notes', 'Notas', 'order-notes'],
    ].map(([id, label, next]) => ({ id, label, onClick: () => edit(next, label) }))} />;
  }
  return null;
}
