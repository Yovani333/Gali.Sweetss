export default function Logo({ compact = false }) {
  if (compact) {
    return (
      <a className="logo logo--compact" href="#inicio" aria-label="Gali Sweets inicio">
        <span>Gali</span>
        <span>Sweets</span>
        <svg viewBox="0 0 46 26" aria-hidden="true" className="logo__hearts">
          <path d="M9.8 8.1c0-3.1 4-4 5.5-1.3 1.6-2.7 5.5-1.8 5.5 1.3 0 3.9-5.5 7.1-5.5 7.1s-5.5-3.2-5.5-7.1Z" />
          <path d="M28 12.8c0-2.6 3.2-3.2 4.4-1.1 1.2-2.1 4.4-1.5 4.4 1.1 0 3.1-4.4 5.7-4.4 5.7S28 15.9 28 12.8Z" />
        </svg>
      </a>
    );
  }

  return (
    <a className="logo" href="#inicio" aria-label="Gali Sweets inicio">
      <span>Gali Sweets</span>
      <svg viewBox="0 0 46 26" aria-hidden="true" className="logo__hearts">
        <path d="M9.8 8.1c0-3.1 4-4 5.5-1.3 1.6-2.7 5.5-1.8 5.5 1.3 0 3.9-5.5 7.1-5.5 7.1s-5.5-3.2-5.5-7.1Z" />
        <path d="M28 12.8c0-2.6 3.2-3.2 4.4-1.1 1.2-2.1 4.4-1.5 4.4 1.1 0 3.1-4.4 5.7-4.4 5.7S28 15.9 28 12.8Z" />
      </svg>
    </a>
  );
}
