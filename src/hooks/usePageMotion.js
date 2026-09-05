import { useEffect } from 'react';

const groups = [
  ['.hero__copy > *', 10, 1],
  ['.hero__image-wrap', 0, 0.995],
  ['.section-title, .about__content > h2, .testimonials-panel h2', 8, 1],
  ['.product-card', 16, 0.99],
  ['.about__badge, .about__content > p', 10, 1],
  ['.benefit', 8, 1],
  ['.testimonial-card', 12, 1],
  ['.footer__brand, .footer__col, .copyright', 8, 1],
];

export default function usePageMotion() {
  useEffect(() => {
    const root = document.getElementById('root');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1025px)');
    let dispose = () => {};
    const revealed = new WeakSet();

    function configure() {
      dispose();
      if (reduced.matches || !('IntersectionObserver' in window)) return;

      const animations = new Set();
      const pending = new Map();
      const animated = root.querySelectorAll('.about__badge .logo, .hero');
      const visibility = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          target.classList.toggle('motion-in-view', isIntersecting);
        });
      });
      animated.forEach((element) => visibility.observe(element));

      function reveal(element, immediate = false) {
        const options = pending.get(element);
        if (!options) return;
        pending.delete(element);
        revealed.add(element);
        element.removeAttribute('data-motion-pending');
        if (immediate) return;
        const { distance, scale, delay } = options;
        const keyframes = distance === 0 && scale === 1 ? [{ opacity: 0 }, { opacity: 1 }] : [
          { opacity: 0, transform: `translateY(${distance}px) scale(${scale})` },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ];
        const animation = element.animate(keyframes, { duration: 640, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          reveal(target);
          observer.unobserve(target);
        });
      }, { threshold: 0.06 });

      groups.forEach(([selector, distance, scale]) => {
        root.querySelectorAll(selector).forEach((element, index) => {
          if (revealed.has(element)) return;
          pending.set(element, { distance, scale, delay: (index % 5) * 45 });
          element.setAttribute('data-motion-pending', '');
          observer.observe(element);
        });
      });

      // Keyboard focus must never land in content waiting for its entrance.
      const focus = (event) => {
        for (const element of pending.keys()) {
          if (element.contains(event.target)) reveal(element, true);
        }
        for (const animation of animations) {
          if (animation.effect.target.contains(event.target)) animation.finish();
        }
      };
      root.addEventListener('focusin', focus);

      const cleanups = [];
      if (desktop.matches) {
        root.querySelectorAll('.product-card').forEach((card) => {
          let frame = 0;
          let bounds;
          const enter = () => { bounds = card.getBoundingClientRect(); };
          const move = (event) => {
            if (!bounds) enter();
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
              const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
              card.style.setProperty('--tilt-x', `${-y * 2}deg`);
              card.style.setProperty('--tilt-y', `${x * 2}deg`);
            });
          };
          const leave = () => {
            cancelAnimationFrame(frame);
            bounds = undefined;
            card.style.removeProperty('--tilt-x');
            card.style.removeProperty('--tilt-y');
          };
          card.addEventListener('pointerenter', enter);
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', leave);
          card.addEventListener('pointercancel', leave);
          cleanups.push(() => {
            leave();
            card.removeEventListener('pointerenter', enter);
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerleave', leave);
            card.removeEventListener('pointercancel', leave);
          });
        });

        const hearts = [...root.querySelectorAll('.panel-heart')];
        let frame = 0;
        const scroll = () => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            const offsets = hearts.map((heart) => {
              const rect = heart.parentElement.getBoundingClientRect();
              return Math.max(-3, Math.min(3, (window.innerHeight / 2 - rect.top) * 0.008));
            });
            hearts.forEach((heart, index) => { heart.style.translate = `0 ${offsets[index]}px`; });
          });
        };
        window.addEventListener('scroll', scroll, { passive: true });
        scroll();
        cleanups.push(() => {
          cancelAnimationFrame(frame);
          window.removeEventListener('scroll', scroll);
          hearts.forEach((heart) => heart.style.removeProperty('translate'));
        });
      }

      dispose = () => {
        observer.disconnect();
        visibility.disconnect();
        animations.forEach((animation) => animation.cancel());
        pending.forEach((_, element) => element.removeAttribute('data-motion-pending'));
        animated.forEach((element) => element.classList.remove('motion-in-view'));
        root.removeEventListener('focusin', focus);
        cleanups.forEach((cleanup) => cleanup());
      };
    }

    configure();
    reduced.addEventListener('change', configure);
    desktop.addEventListener('change', configure);
    return () => {
      dispose();
      reduced.removeEventListener('change', configure);
      desktop.removeEventListener('change', configure);
    };
  }, []);
}
