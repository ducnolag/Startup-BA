'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Lenis from 'lenis';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // ─── Lenis smooth scroll ─────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ─── Animate a single element ────────────────────────────────────
    const animateEl = (el: HTMLElement) => {
      if (el.dataset.animDone === '1') return;
      el.dataset.animDone = '1';

      const delay = parseFloat(el.dataset.animDelay || '0');
      const distance = parseFloat(el.dataset.animDistance || '24');
      const duration = parseFloat(el.dataset.animDuration || '0.8');

      gsap.fromTo(
        el,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
        }
      );
    };

    // ─── Init existing elements ───────────────────────────────────────
    const initAll = () => {
      document.querySelectorAll<HTMLElement>('[data-anim]').forEach(animateEl);
    };

    // Wait two frames so all child components have hydrated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initAll();
      });
    });

    // ─── IntersectionObserver for elements added dynamically ──────────
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateEl(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0 }
    );

    // Watch for new [data-anim] elements
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches?.('[data-anim]')) {
            animateEl(node);
          }
          node.querySelectorAll?.<HTMLElement>('[data-anim]').forEach(animateEl);
        });
      }
    });

    // Start observing existing + future elements
    const observerCb = (el: HTMLElement) => {
      if (el.dataset.animDone !== '1') io.observe(el);
    };

    document.querySelectorAll<HTMLElement>('[data-anim]').forEach(observerCb);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}