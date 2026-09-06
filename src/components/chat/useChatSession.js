import { useEffect, useRef, useState } from 'react';
import { CHAT_STORAGE_KEY, emptyOrder } from './chatUtils.js';

const greeting = { id: 'welcome', role: 'bot', text: 'Hola 👋\n¿En qué podemos ayudarte?' };

function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(CHAT_STORAGE_KEY));
    if (saved?.order && Array.isArray(saved.messages)) return saved;
  } catch {
    sessionStorage.removeItem(CHAT_STORAGE_KEY);
  }
  return { screen: 'menu', stack: [], order: emptyOrder, messages: [greeting], flowMode: 'order', editing: false };
}

export default function useChatSession() {
  const [session, setSession] = useState(loadSession);
  const [typing, setTyping] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function transition({ next, user, bot, replace = false, patch = {} }) {
    clearTimeout(timer.current);
    setTyping(true);
    setSession((current) => ({
      ...current,
      ...patch,
      messages: user ? [...current.messages, { id: crypto.randomUUID(), role: 'user', text: user }] : current.messages,
    }));
    timer.current = setTimeout(() => {
      setSession((current) => ({
        ...current,
        screen: next,
        stack: replace ? current.stack : [...current.stack, current.screen],
        messages: bot ? [...current.messages, { id: crypto.randomUUID(), role: 'bot', text: bot }] : current.messages,
      }));
      setTyping(false);
    }, 420);
  }

  function updateOrder(values) {
    setSession((current) => ({ ...current, order: { ...current.order, ...values } }));
  }

  function back() {
    clearTimeout(timer.current);
    setTyping(false);
    setSession((current) => {
      const stack = [...current.stack];
      const screen = stack.pop() || 'menu';
      return { ...current, screen, stack };
    });
  }

  function menu() {
    clearTimeout(timer.current);
    setTyping(false);
    setSession((current) => ({ ...current, screen: 'menu', stack: [], editing: false }));
  }

  function reset() {
    clearTimeout(timer.current);
    sessionStorage.removeItem(CHAT_STORAGE_KEY);
    setTyping(false);
    setSession({ screen: 'menu', stack: [], order: { ...emptyOrder }, messages: [greeting], flowMode: 'order', editing: false });
  }

  return { session, setSession, typing, transition, updateOrder, back, menu, reset };
}
