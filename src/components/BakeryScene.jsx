import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import fallback from '../../Catalogo Gali/Mejoradas/Pastel de 3 Camas.png';
import { createBakeryScene } from '../three/createBakeryScene.js';
import './bakery-scene.css';

export default function BakeryScene() {
  const host = useRef(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useLayoutEffect(() => {
    try {
      const scene = createBakeryScene(host.current, () => pausedRef.current, () => {
        setReady(false);
        setFailed(true);
      });
      setReady(true);
      return () => scene.dispose();
    } catch {
      setFailed(true);
      return undefined;
    }
  }, []);

  return (
    <div className="hero__image-wrap bakery-scene" id="galeria">
      {failed && <img className="bakery-scene__fallback" src={fallback} alt="Pastel rosa y blanco completo de Gali Sweets" />}
      <div ref={host} className="bakery-scene__canvas" />
      {ready && <button
        type="button"
        className="bakery-scene__pause"
        aria-label={paused ? 'Reanudar animacion' : 'Pausar animacion'}
        title={paused ? 'Reanudar animacion' : 'Pausar animacion'}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
    </div>
  );
}
