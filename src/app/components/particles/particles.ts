import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';

interface Dot { x: number; y: number; vx: number; vy: number; r: number; }

/**
 * Full-screen canvas of glowing particles.
 * - Nearby particles are joined by faint lines (network effect).
 * - Particles near the mouse are pushed away and linked to the cursor.
 * - Colors follow the Material theme (primary / tertiary).
 */
@Component({
  selector: 'app-particles',
  template: `<canvas #c aria-hidden="true"></canvas>`,
  styles: [`
    canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; }
  `],
})
export class Particles {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('c');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Browser-only setup after first render
    afterNextRender(() => this.start());
  }

  private start(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 130;      // max distance for particle-to-particle lines
    const MOUSE_R = 160;   // mouse influence radius
    let dots: Dot[] = [];
    let w = 0, h = 0, raf = 0;

    // Read theme colors from Material CSS variables (updates on dark-mode toggle)
    const color = (v: string, fb: string) =>
      getComputedStyle(document.body).getPropertyValue(v).trim() || fb;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with screen area, capped for performance
      const count = Math.min(Math.floor((w * h) / 12000), 140);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
        r: Math.random() * 2.2 + 1.2,
      }));
    };

    const frame = () => {
      const primary = color('--accent-1', '#334155');
      const tertiary = color('--accent-2', '#93c5fd');
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        // Repel from cursor
        const mx = d.x - mouse.x, my = d.y - mouse.y, md = Math.hypot(mx, my);
        if (md < MOUSE_R && md > 0) {
          const f = (MOUSE_R - md) / MOUSE_R * .6;
          d.vx += (mx / md) * f; d.vy += (my / md) * f;
        }
        // Friction + gentle minimum drift
        d.vx *= .96; d.vy *= .96;
        d.x += d.vx + Math.sign(d.vx || 1) * .15;
        d.y += d.vy + Math.sign(d.vy || 1) * .15;
        // Wrap around edges
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
      }

      // Lines between close particles
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK) {
            ctx.globalAlpha = (1 - dist / LINK) * .5;
            ctx.strokeStyle = primary;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        // Lines to the cursor
        const md = Math.hypot(dots[i].x - mouse.x, dots[i].y - mouse.y);
        if (md < MOUSE_R * 1.3) {
          ctx.globalAlpha = (1 - md / (MOUSE_R * 1.3)) * .6;
          ctx.strokeStyle = tertiary;
          ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }

      // Glowing dots
      ctx.shadowBlur = 22;
      for (const [i, d] of dots.entries()) {
        const c = i % 3 === 0 ? tertiary : primary;
        ctx.globalAlpha = 1; ctx.fillStyle = c; ctx.shadowColor = c;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };

    resize(); frame();
    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    // Clean up when the component is destroyed
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    });
  }
}
