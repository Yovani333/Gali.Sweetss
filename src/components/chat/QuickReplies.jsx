export default function QuickReplies({ options }) {
  return (
    <div className="quick-replies">
      {options.map(({ id, label, icon: Icon, onClick, href }) => href ? (
        <a key={id} className="quick-reply" href={href} target="_blank" rel="noreferrer">
          {Icon && <Icon size={17} aria-hidden="true" />}<span>{label}</span>
        </a>
      ) : (
        <button key={id} className="quick-reply" type="button" onClick={onClick}>
          {Icon && <Icon size={17} aria-hidden="true" />}<span>{label}</span>
        </button>
      ))}
    </div>
  );
}
