import { useState } from 'react';
import { cleanText } from './chatUtils.js';

export default function TextStep({ id, label, initialValue = '', placeholder, optional = false, multiline = false, maxLength = 180, onSubmit }) {
  const [value, setValue] = useState(initialValue);
  const valid = optional || cleanText(value, maxLength).length > 0;
  const Input = multiline ? 'textarea' : 'input';
  return (
    <form className="chat-form" onSubmit={(event) => { event.preventDefault(); if (valid) onSubmit(cleanText(value, maxLength)); }}>
      <label htmlFor={id}>{label}{optional && <span> (opcional)</span>}</label>
      <Input id={id} type={multiline ? undefined : 'text'} rows={multiline ? 3 : undefined} maxLength={maxLength} placeholder={placeholder} value={value} onChange={(event) => setValue(event.target.value)} />
      <button className="chat-primary" type="submit" disabled={!valid}>Continuar</button>
    </form>
  );
}
