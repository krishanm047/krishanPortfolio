import { Component, DestroyRef, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Portfolio } from '../../models/portfolio';

/** Hero: status badge, gradient name, typing roles, CTAs, live stats and an animated photo ring. */
@Component({
  selector: 'app-hero',
  imports: [MatButtonModule, MatIconModule],
  template: `
    @let p = data().profile;
    <section id="home" class="hero">
      <div class="left">
        <span class="badge" data-reveal><span class="pulse"></span> Open to new opportunities</span>
        <h1 data-reveal><span class="hi">Hi, I'm</span><span class="grad name">{{ p.name }}</span></h1>
        <p class="typing" data-reveal>
          <span class="mono">&gt;</span> {{ typed() }}<span class="caret"></span>
        </p>
        <p class="tagline" data-reveal>{{ p.tagline }}</p>
        <div class="actions" data-reveal>
          <a mat-flat-button class="btn-grad" href="#projects"><mat-icon>rocket_launch</mat-icon> View my work</a>
          <a mat-stroked-button class="btn-ghost" href="#contact"><mat-icon>mail</mat-icon> Let's talk</a>
          @if (p.resumeUrl) {
            <a mat-stroked-button class="btn-ghost" [href]="p.resumeUrl" target="_blank"><mat-icon>download</mat-icon> Resume</a>
          }
        </div>
        <div class="stats" data-reveal>
          @for (s of stats(); track s.label) {
            <div class="stat"><span class="num grad">{{ s.value }}</span><span class="lbl">{{ s.label }}</span></div>
          }
        </div>
      </div>

      <div class="right" data-reveal>
        <div class="photo">
          <div class="ring"></div>
          @if (p.photoUrl && !photoFailed()) {
            <img [src]="p.photoUrl" [alt]="p.name" (error)="photoFailed.set(true)">
          } @else {
            <span class="initials">{{ initials() }}</span>
          }
          <!-- Floating tech chips around the photo -->
          <span class="float f1 glass"><mat-icon>coffee</mat-icon> Java</span>
          <span class="float f2 glass"><mat-icon>eco</mat-icon> Spring</span>
          <span class="float f3 glass"><mat-icon>fact_check</mat-icon> Cypress</span>
          <span class="float f4 glass"><mat-icon>change_history</mat-icon> Angular</span>
          <span class="float f5 glass"><mat-icon>smart_toy</mat-icon> AI &amp; Copilot</span>
        </div>
      </div>

      <a class="scroll-hint" href="#about" aria-label="Scroll down"><span></span></a>
    </section>
  `,
  styles: [`
    .hero { position: relative; min-height: 100vh; max-width: 1180px; margin: 0 auto; padding: 130px 24px 80px;
      display: grid; grid-template-columns: 1.15fr .85fr; align-items: center; gap: 56px; }
    .badge { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: 999px;
      font-size: .85rem; color: #cfe; background: rgba(34, 211, 238, .08); border: 1px solid rgba(34, 211, 238, .25); }
    .pulse { width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 0 rgba(52,211,153,.7);
      animation: pulse 2s infinite; }
    @keyframes pulse { 70% { box-shadow: 0 0 0 10px rgba(52,211,153,0); } 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); } }
    h1 { display: flex; flex-direction: column; gap: 6px; font-size: clamp(2.6rem, 6.2vw, 5.2rem); font-weight: 900; line-height: 1.02; letter-spacing: -.045em; margin: 22px 0 18px; }
    .hi { font-size: clamp(1.3rem, 2.4vw, 1.9rem); font-weight: 600; letter-spacing: -.01em; color: var(--muted); }
    .name { filter: drop-shadow(0 6px 30px color-mix(in srgb, var(--accent-1) 45%, transparent)); }
    .typing { font-size: clamp(1.1rem, 2.2vw, 1.5rem); font-weight: 600; color: #fff; margin: 0 0 18px; min-height: 1.6em; }
    .mono { font-family: 'JetBrains Mono', Consolas, monospace; color: var(--accent-2); margin-right: 6px; }
    .caret { display: inline-block; width: 3px; height: 1.1em; margin-left: 4px; vertical-align: -3px;
      background: var(--accent-2); animation: blink 1s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
    .tagline { color: var(--muted); font-size: 1.05rem; line-height: 1.7; max-width: 560px; margin: 0; }
    .actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
    .stats { display: flex; gap: 36px; margin-top: 48px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,.08); flex-wrap: wrap; }
    .stat { display: flex; flex-direction: column; }
    .num { font-size: 2.2rem; font-weight: 800; letter-spacing: -.03em; }
    .lbl { color: var(--muted); font-size: .85rem; }

    .right { position: relative; display: grid; justify-items: center; align-self: start;
      min-height: 420px; padding-top: 56px; }  /* 56px ≈ badge height + gap, lines up with 'Hi, I'm' */
    .photo { position: relative; width: clamp(180px, 18vw, 250px); aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center; }
    .ring { position: absolute; inset: -6px; border-radius: 50%;
      background: conic-gradient(from 0deg, var(--accent-1), var(--accent-2), var(--accent-3), var(--accent-1));
      animation: spin 8s linear infinite; filter: drop-shadow(0 0 30px color-mix(in srgb, var(--accent-1) 60%, transparent)); }
    .ring::after { content: ''; position: absolute; inset: 6px; border-radius: 50%; background: var(--bg); }
    @keyframes spin { to { transform: rotate(360deg); } }
    img, .initials { position: relative; width: calc(100% - 16px); height: calc(100% - 16px); border-radius: 50%; object-fit: cover; }
    .initials { display: grid; place-items: center; font-size: 3.8rem; font-weight: 900; background: var(--grad); }
    .float { position: absolute; display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px !important;
      border-radius: 14px !important; font-size: .88rem; font-weight: 600; white-space: nowrap; animation: bob 6s ease-in-out infinite; }
    .float mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--accent-2); }
    .float { z-index: 2; }
    /* Five chips spaced around the photo circle */
    .f1 { top: -6%; left: -30%; }
    .f2 { top: 40%; left: -46%; animation-delay: -1.2s; }
    .f3 { top: 4%; right: -40%; animation-delay: -2.4s; }
    .f4 { bottom: -14%; left: -26%; animation-delay: -3.6s; }
    .f5 { bottom: -8%; right: -42%; animation-delay: -4.8s; }
    @keyframes bob { 50% { transform: translateY(-14px); } }

    .scroll-hint { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: 26px; height: 42px;
      border: 2px solid rgba(255,255,255,.25); border-radius: 14px; }
    .scroll-hint span { position: absolute; top: 8px; left: 50%; width: 4px; height: 8px; margin-left: -2px; border-radius: 2px;
      background: var(--accent-2); animation: wheel 1.8s infinite; }
    @keyframes wheel { to { transform: translateY(14px); opacity: 0; } }

    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; text-align: center; padding-top: 120px; }
      .right { order: -1; max-width: 220px; margin: 0 auto; min-height: 0; padding-top: 0; align-self: center; }
      .actions, .stats { justify-content: center; } .tagline { margin: 0 auto; }
      .float { display: none; } .scroll-hint { display: none; }
    }
  `],
})
export class Hero {
  readonly data = input.required<Portfolio>();
  readonly photoFailed = signal(false);
  readonly typed = signal('');

  private readonly roles = [
    'Java Full Stack Developer', 'Angular & Spring Engineer', 'Cypress Automation Specialist', 'AI & Copilot Studio Builder',
  ];

  readonly initials = computed(() => this.data().profile.name.split(' ').map(n => n[0]).join('').slice(0, 2));
  readonly stats = computed(() => {
    const d = this.data();
    return [
      { value: `${d.profile.yearsOfExperience}+`, label: 'Years experience' },
      { value: `${d.projects.length}`, label: 'Key projects' },
      { value: `${d.skills.reduce((n, g) => n + g.items.length, 0)}+`, label: 'Technologies' },
    ];
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Typewriter loop: type, pause, delete, next role
    afterNextRender(() => {
      let role = 0, i = 0, deleting = false, timer = 0;
      const tick = () => {
        const word = this.roles[role];
        i += deleting ? -1 : 1;
        this.typed.set(word.slice(0, i));
        let delay = deleting ? 40 : 85;
        if (!deleting && i === word.length) { deleting = true; delay = 1600; }
        else if (deleting && i === 0) { deleting = false; role = (role + 1) % this.roles.length; delay = 350; }
        timer = window.setTimeout(tick, delay);
      };
      tick();
      destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }
}
