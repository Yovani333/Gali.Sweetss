import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import fallback from '../../Catalogo Gali/Mejoradas/Pastel de 3 Camas.png';
import './bakery-scene.css';

export default function BakeryScene() {
  const host = useRef(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    let cancelled = false;
    let scene;
    import('../three/createBakeryScene.js').then(({ createBakeryScene }) => {
      if (cancelled) return;
      try {
        scene = createBakeryScene(host.current, () => pausedRef.current, () => setReady(false));
        setReady(true);
      } catch {
        setReady(false);
      }
    }).catch(() => setReady(false));
    return () => { cancelled = true; scene?.dispose(); };
  }, []);

  return (
    <div className="hero__image-wrap bakery-scene" id="galeria">
      {!ready && <img className="bakery-scene__fallback" src={fallback} alt="Pastel rosa y blanco completo de Gali Sweets" />}
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
