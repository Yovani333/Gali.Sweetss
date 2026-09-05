import { useEffect } from 'react';

const groups = [
  { selector: '.hero__copy > *', distance: 10, duration: 900, stagger: 85 },
  { selector: '.hero__image-wrap', scale: 0.997, duration: 1100 },
  { selector: '.section-title', distance: 6, duration: 800 },
  { selector: '.product-card', distance: 8, duration: 780, stagger: 65 },
  { selector: '.about__badge', scale: 0.997, duration: 900 },
  { selector: '.about__content, .testimonials-panel h2', duration: 700 },
  { selector: '.testimonial-card', duration: 700, stagger: 50 },
  { selector: '.footer__inner, .copyright', duration: 650 },
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
      const entranceEase = getComputedStyle(root).getPropertyValue('--motion-ease').trim();
      const animated = root.querySelectorAll('.about__badge .logo, .hero');
      const visibility = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          target.classList.toggle('motion-in-view', isIntersecting);
        });
      });
      animated.forEach((element) => visibility.observe(element));

      function reveal(element, immediate = false, delay = 0) {
        const options = pending.get(element);
        if (!options) return;
        pending.delete(element);
        revealed.add(element);
        element.removeAttribute('data-motion-pending');
        if (immediate) return;
        const { distance = 0, scale = 1, duration } = options;
        const travel = desktop.matches ? distance : distance * 0.6;
        const keyframes = distance === 0 && scale === 1 ? [{ opacity: 0 }, { opacity: 1 }] : [
          { opacity: 0, transform: `translateY(${travel}px) scale(${scale})` },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ];
        const animation = element.animate(keyframes, { duration, delay, easing: entranceEase, fill: 'backwards' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }

      const observer = new IntersectionObserver((entries) => {
        // Stagger only newly visible siblings, independent of the grid column count.
        const counts = new Map();
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          const group = pending.get(target);
          const index = counts.get(group) || 0;
          counts.set(group, index + 1);
          const stagger = desktop.matches ? (group?.stagger || 0) : Math.min(group?.stagger || 0, 40);
          reveal(target, false, Math.min(index * stagger, desktop.matches ? 255 : 80));
          observer.unobserve(target);
        });
      }, { threshold: 0.06 });

      groups.forEach((group) => {
        root.querySelectorAll(group.selector).forEach((element) => {
          if (revealed.has(element)) return;
          pending.set(element, group);
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
              card.style.setProperty('--tilt-x', `${-y * 1.2}deg`);
              card.style.setProperty('--tilt-y', `${x * 1.2}deg`);
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
              return Math.max(-2, Math.min(2, (window.innerHeight / 2 - rect.top) * 0.005));
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
