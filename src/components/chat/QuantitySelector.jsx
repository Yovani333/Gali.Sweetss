import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export default function QuantitySelector({ initialValue, onSubmit }) {
  const [quantity, setQuantity] = useState(Math.min(20, Math.max(1, Number(initialValue) || 1)));
  const update = (value) => setQuantity(Math.min(20, Math.max(1, Number(value) || 1)));
  return (
    <form className="chat-form" onSubmit={(event) => { event.preventDefault(); onSubmit(quantity); }}>
      <label htmlFor="chat-quantity">Cantidad</label>
      <div className="quantity-control">
        <button type="button" aria-label="Disminuir cantidad" disabled={quantity <= 1} onClick={() => update(quantity - 1)}><Minus size={17} /></button>
        <input id="chat-quantity" type="number" inputMode="numeric" min="1" max="20" value={quantity} onChange={(event) => update(event.target.value)} />
        <button type="button" aria-label="Aumentar cantidad" disabled={quantity >= 20} onClick={() => update(quantity + 1)}><Plus size={17} /></button>
      </div>
      <button className="chat-primary" type="submit">Continuar</button>
    </form>
  );
}
