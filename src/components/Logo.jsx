import primaryLogo from '../../Logos Gali/Logo2.png';
import roundLogo from '../../Logos Gali/Logo1.png';

export default function Logo({ compact = false }) {
  if (compact) {
    return (
      <a className="logo logo--compact" href="#inicio" aria-label="Gali Sweets inicio">
        <img src={roundLogo} alt="Gali Sweets" />
      </a>
    );
  }

  return (
    <a className="logo" href="#inicio" aria-label="Gali Sweets inicio">
      <img src={primaryLogo} alt="Gali Sweets" />
    </a>
  );
}
