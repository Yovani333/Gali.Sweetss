import { useEffect, useRef } from 'react';

export default function ChatMessages({ messages, typing, children }) {
  const end = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, typing, children]);

  return (
    <div className="chat-content" aria-live="polite" aria-busy={typing}>
      <div className="chat-messages">
        {messages.map((message) => (
          <p className={`chat-message chat-message--${message.role}`} key={message.id}>{message.text}</p>
        ))}
        {typing && <div className="chat-typing" aria-label="Gali Sweets está escribiendo"><span /><span /><span /></div>}
      </div>
      {!typing && <div className="chat-actions">{children}</div>}
      <span ref={end} />
    </div>
  );
}
