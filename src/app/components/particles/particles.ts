import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';

interface Dot { x: number; y: number; vx: number; vy: number; r: number; }

/** Canvas of glowing, linked particles that react to the mouse. Colours come from --accent-1/2. */
@Component({
  selector: 'app-particles',
  template: `<canvas #c aria-hidden="true"></canvas>`,
  styles: [`canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; }`],
})
export class Particles {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('c');
  private readonly destroyRef = inject(DestroyRef);

  constructor() { afterNextRender(() => this.start()); }

  private start(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 120, MOUSE_R = 170;
    const css = getComputedStyle(document.documentElement);
    const c1 = css.getPropertyValue('--accent-1').trim() || '#8b5cf6';
    const c2 = css.getPropertyValue('--accent-2').trim() || '#22d3ee';
    let dots: Dot[] = [], w = 0, h = 0, raf = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((w * h) / 14000), 120);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 1.6 + .6,
      }));
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const mx = d.x - mouse.x, my = d.y - mouse.y, md = Math.hypot(mx, my);
        if (md < MOUSE_R && md > 0) { const f = (MOUSE_R - md) / MOUSE_R * .5; d.vx += mx / md * f; d.vy += my / md * f; }
        d.vx *= .96; d.vy *= .96;
        d.x += d.vx + Math.sign(d.vx || 1) * .12; d.y += d.vy + Math.sign(d.vy || 1) * .12;
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0; if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
          if (dist < LINK) {
            ctx.globalAlpha = (1 - dist / LINK) * .28; ctx.strokeStyle = c1;
            ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke();
          }
        }
        const md = Math.hypot(dots[i].x - mouse.x, dots[i].y - mouse.y);
        if (md < MOUSE_R * 1.3) {
          ctx.globalAlpha = (1 - md / (MOUSE_R * 1.3)) * .55; ctx.strokeStyle = c2;
          ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      ctx.shadowBlur = 16;
      dots.forEach((d, i) => {
        const c = i % 3 === 0 ? c2 : c1;
        ctx.globalAlpha = .9; ctx.fillStyle = c; ctx.shadowColor = c;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    resize(); frame();
    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    });
  }
}
