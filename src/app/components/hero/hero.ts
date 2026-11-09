import { Component, computed, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Profile } from '../../models/portfolio';

@Component({
  selector: 'app-hero',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <section id="home" class="hero">
      <div class="content">
        <p class="hello">Hi, I'm</p>
        <h1>{{ profile().name }}</h1>
        <h2>{{ profile().title }}</h2>
        <p class="tagline">{{ profile().tagline }}</p>
        <div class="actions">
          <a mat-flat-button href="#projects"><mat-icon>work</mat-icon> View my work</a>
          <a mat-stroked-button href="#contact"><mat-icon>mail</mat-icon> Get in touch</a>
          @if (profile().resumeUrl) {
            <a mat-button [href]="profile().resumeUrl" target="_blank"><mat-icon>download</mat-icon> Resume</a>
          }
        </div>
      </div>
      <div class="avatar">
        @if (profile().photoUrl && !photoFailed()) {
          <!-- Falls back to initials if public/profile.jpg is missing -->
          <img [src]="profile().photoUrl" [alt]="profile().name" (error)="photoFailed.set(true)">
        } @else {
          <span aria-hidden="true">{{ initials() }}</span>
        }
      </div>
    </section>
  `,
  styles: [`
    .hero { min-height: calc(100vh - 64px); max-width: 1120px; margin: 0 auto; padding: 48px 24px;
      display: flex; align-items: center; justify-content: space-between; gap: 48px; }
    .hello { color: var(--mat-sys-primary); font-weight: 600; margin: 0; }
    h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; margin: 8px 0; line-height: 1.05; }
    h2 { font-size: clamp(1.25rem, 3vw, 2rem); font-weight: 500; margin: 0 0 16px; color: var(--mat-sys-on-surface-variant); }
    .tagline { max-width: 560px; font-size: 1.1rem; line-height: 1.6; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
    .avatar { flex: 0 0 280px; height: 280px; border-radius: 50%; display: grid; place-items: center;
      font-size: 6rem; font-weight: 800; color: var(--mat-sys-on-primary);
      background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
      box-shadow: 0 0 30px color-mix(in srgb, var(--accent-1) 70%, transparent), 0 0 80px color-mix(in srgb, var(--accent-2) 45%, transparent);
      padding: 6px; overflow: hidden; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
    @media (max-width: 800px) { .hero { flex-direction: column-reverse; text-align: center; }
      .actions { justify-content: center; } .avatar { flex-basis: 180px; width: 180px; height: 180px; font-size: 4rem; } }
  `],
})
export class Hero {
  readonly profile = input.required<Profile>();
  readonly photoFailed = signal(false);
  readonly initials = computed(() => this.profile().name.split(' ').map(p => p[0]).join('').slice(0, 2));
}
