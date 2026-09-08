import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Maximize, X, ZoomIn, ZoomOut } from 'lucide-react';
import './image-viewer.css';

export default function ImageViewer({ image, onClose }) {
  const dialog = useRef(null);
  const viewport = useRef(null);
  const drag = useRef(null);
  const capturedClick = useRef(false);
  const [space, setSpace] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [intrinsic, setIntrinsic] = useState({ width: image.width, height: image.height });
  const fit = Math.min(1, space.width / intrinsic.width, space.height / intrinsic.height);
  const maxZoom = fit > 0 ? Math.max(1, Math.min(4, 1 / fit)) : 1;
  const magnification = Math.min(zoom, maxZoom);
  const width = intrinsic.width * fit * magnification;
  const height = intrinsic.height * fit * magnification;

  useLayoutEffect(() => {
    const modal = dialog.current;
    const previousFocus = document.activeElement;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.paddingRight = `${parseFloat(getComputedStyle(root).paddingRight) + scrollbar}px`;
    root.style.overflow = 'hidden';
    modal.showModal();
    return () => {
      modal.close();
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setSpace({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const area = viewport.current;
    area.scrollLeft = Math.max(0, (width - area.clientWidth) / 2);
    area.scrollTop = Math.max(0, (height - area.clientHeight) / 2);
  }, [width, height]);

  const changeZoom = (direction) => setZoom(Math.min(maxZoom, Math.max(1, magnification + direction * 0.5)));
  const stopDrag = () => {
    drag.current = null;
    viewport.current.classList.remove('is-dragging');
  };

  return (
    <dialog
      ref={dialog}
      className="image-viewer"
      aria-label={`Vista ampliada: ${image.alt}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={(event) => {
        if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(1); }
        if (event.key === '-') { event.preventDefault(); changeZoom(-1); }
        if (event.key === '0') { event.preventDefault(); setZoom(1); }
      }}
    >
      <div className="image-viewer__controls" role="group" aria-label="Controles de imagen">
        {maxZoom > 1.01 && <>
          <button type="button" title="Reducir zoom" aria-label="Reducir zoom" disabled={magnification <= 1} onClick={() => changeZoom(-1)}><ZoomOut size={21} /></button>
          <button type="button" title="Ampliar zoom" aria-label="Ampliar zoom" disabled={magnification >= maxZoom} onClick={() => changeZoom(1)}><ZoomIn size={21} /></button>
          <button type="button" title="Ajustar imagen" aria-label="Ajustar imagen" disabled={magnification <= 1} onClick={() => setZoom(1)}><Maximize size={20} /></button>
        </>}
        <button type="button" title="Cerrar imagen" aria-label="Cerrar imagen" autoFocus onClick={onClose}><X size={23} /></button>
      </div>
      <div
        className={`image-viewer__viewport ${magnification > 1 ? 'is-zoomed' : ''}`}
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-label="Imagen ampliada"
        onClick={(event) => {
          if (capturedClick.current) { capturedClick.current = false; return; }
          if (event.target === event.currentTarget || event.target.classList.contains('image-viewer__stage')) onClose();
        }}
        onPointerDown={(event) => {
          capturedClick.current = false;
          if (event.pointerType !== 'mouse' || event.button !== 0 || magnification <= 1) return;
          capturedClick.current = true;
          event.preventDefault();
          drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop };
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.classList.add('is-dragging');
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
          event.currentTarget.scrollTop = drag.current.top - (event.clientY - drag.current.y);
        }}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
      >
        <div className="image-viewer__stage" style={{ width: Math.max(space.width, width), height: Math.max(space.height, height) }}>
          <img
            className="image-viewer__image"
            src={image.src}
            alt={image.alt}
            draggable={false}
            style={{ width, height }}
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              if (naturalWidth && naturalHeight) setIntrinsic({ width: naturalWidth, height: naturalHeight });
            }}
            onDoubleClick={() => setZoom(magnification > 1 ? 1 : Math.min(2, maxZoom))}
          />
        </div>
      </div>
    </dialog>
  );
}
