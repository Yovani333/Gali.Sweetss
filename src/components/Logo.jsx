import primaryLogo from '../assets/brand/logo-primary.png';
import roundLogo from '../assets/brand/logo-round.png';

export default function Logo({ compact = false }) {
  if (compact) {
    return (
      <a className="logo logo--compact" href="#inicio" aria-label="Gali Sweets inicio">
        <img src={roundLogo} alt="Gali Sweets" decoding="async" />
      </a>
    );
  }

  return (
    <a className="logo" href="#inicio" aria-label="Gali Sweets inicio">
      <img src={primaryLogo} alt="Gali Sweets" decoding="async" />
    </a>
  );
}
