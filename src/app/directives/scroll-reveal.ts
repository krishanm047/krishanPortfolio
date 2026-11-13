import { DestroyRef, inject, afterNextRender } from '@angular/core';

/**
 * Reveals every element marked with the data-reveal attribute as it scrolls into view.
 * Siblings are staggered by 90 ms. Call once from the root component's constructor.
 */
export function setupScrollReveal(): void {
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

    targets.forEach(el => {
      el.classList.add('reveal');
      const idx = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.style.transitionDelay = `${Math.min(idx * 90, 450)}ms`;
    });

    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.classList.add('visible');
          // Clear the delay afterwards so hover transitions stay snappy
          setTimeout(() => (el.style.transitionDelay = '0ms'), 1300);
          io.unobserve(el);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => io.observe(el));
    destroyRef.onDestroy(() => io.disconnect());
  });
}
