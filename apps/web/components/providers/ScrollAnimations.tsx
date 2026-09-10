'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ───────────────────────────────────────────────────────
   useParallax — Move element at a different speed on scroll
   ─────────────────────────────────────────────────────── */
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/* ───────────────────────────────────────────────────────
   useScrollReveal — Reveal with scale + rotation on scroll
   ─────────────────────────────────────────────────────── */
export function useScrollReveal(options?: {
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  stagger?: number;
  childSelector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      delay = 0,
      duration = 1,
      y = 60,
      scale = 0.95,
      rotation = 0,
      stagger = 0.1,
      childSelector,
    } = options || {};

    const targets = childSelector ? el.querySelectorAll(childSelector) : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
          scale,
          rotation,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 20%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
}

/* ───────────────────────────────────────────────────────
   useCountUp — Animate number counting up when in viewport
   ─────────────────────────────────────────────────────── */
export function useCountUp(
  endValue: number,
  options?: { duration?: number; suffix?: string; prefix?: string }
) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { duration = 2, suffix = '', prefix = '' } = options || {};
    const proxy = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        val: endValue,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          if (el) {
            const formatted =
              endValue >= 1000
                ? new Intl.NumberFormat('vi-VN').format(Math.round(proxy.val))
                : endValue % 1 !== 0
                ? proxy.val.toFixed(2)
                : Math.round(proxy.val).toString();
            el.textContent = `${prefix}${formatted}${suffix}`;
          }
        },
      });
    });

    return () => ctx.revert();
  }, [endValue, options]);

  return ref;
}

/* ───────────────────────────────────────────────────────
   useScaleReveal — Scale from 0.8 → 1 on scroll
   ─────────────────────────────────────────────────────── */
export function useScaleReveal(options?: {
  startScale?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { startScale = 0.85, duration = 1.2 } = options || {};

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          scale: startScale,
        },
        {
          opacity: 1,
          scale: 1,
          duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
}

/* ───────────────────────────────────────────────────────
   useHorizontalSlide — Elements slide in from left/right
   ─────────────────────────────────────────────────────── */
export function useHorizontalSlide(direction: 'left' | 'right' = 'left', distance = 100) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const x = direction === 'left' ? -distance : distance;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [direction, distance]);

  return ref;
}

/* ───────────────────────────────────────────────────────
   use3DTilt — Mouse-follow 3D tilt effect on cards
   ─────────────────────────────────────────────────────── */
export function use3DTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.15s ease-out';

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 2;
      const yPercent = (y / rect.height - 0.5) * 2;

      el.style.transform = `perspective(800px) rotateX(${-yPercent * maxTilt}deg) rotateY(${xPercent * maxTilt}deg) translateZ(10px)`;
    };

    const handleLeave = () => {
      el.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [maxTilt]);

  return ref;
}

/* ───────────────────────────────────────────────────────
   useTextReveal — Split text and reveal line by line
   ─────────────────────────────────────────────────────── */
export function useTextReveal() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lines = el.querySelectorAll('.reveal-line');
    if (lines.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        {
          opacity: 0,
          y: 40,
          rotateX: -20,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
}
