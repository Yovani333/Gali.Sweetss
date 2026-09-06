import { useState } from 'react';
import { businessConfig } from '../../config/business.js';
import { earliestOrderDate, isOrderDateAllowed } from './chatUtils.js';

export default function DateSelector({ initialValue, onSubmit }) {
  const minimum = earliestOrderDate();
  const [date, setDate] = useState(initialValue >= minimum ? initialValue : '');
  const allowed = isOrderDateAllowed(date);
  return (
    <form className="chat-form" onSubmit={(event) => { event.preventDefault(); if (allowed) onSubmit(date); }}>
      <label htmlFor="chat-date">Fecha solicitada</label>
      <input id="chat-date" type="date" min={minimum} required value={date} onChange={(event) => setDate(event.target.value)} />
      <small>Solicita con al menos {businessConfig.minimumNoticeHours} horas de anticipación. La fecha será confirmada por WhatsApp.</small>
      {date && !allowed && <small className="chat-form__error">Selecciona una fecha de lunes a sábado.</small>}
      <button className="chat-primary" type="submit" disabled={!allowed}>Continuar</button>
    </form>
  );
}
