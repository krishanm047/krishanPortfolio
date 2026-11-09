import { DestroyRef, inject, afterNextRender } from '@angular/core';

/**
 * Scroll-reveal animations for the whole page.
 * Call once from the root component's constructor.
 * Sections, headings and cards fade/slide in as they enter the viewport;
 * cards in the same grid are staggered.
 */
export function setupScrollReveal(): void {
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    // Respect reduced-motion preference: show everything immediately
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll<HTMLElement>(
      '.section-title, .section-subtitle, .mat-mdc-card, .timeline .item, .summary, .form, .hero .content, .hero .avatar');

    targets.forEach(el => {
      el.classList.add('reveal');
      // Stagger siblings (e.g. cards in a grid) by 80ms each, max 400ms
      const idx = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
      if (el.classList.contains('avatar')) el.classList.add('reveal-zoom');
      if (el.closest('.timeline')) el.classList.add('reveal-left');
    });

    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target); // animate once
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => io.observe(el));
    destroyRef.onDestroy(() => io.disconnect());
  });
}
