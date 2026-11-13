import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Profile } from '../../models/portfolio';

@Component({
  selector: 'app-footer',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <footer>
      <p class="signoff grad">Clean code. Scalable systems. Real impact.</p>
      <div class="row">
        <p>© {{ year }} {{ profile().name }} · Built with Angular &amp; Angular Material</p>
        <div class="links">
          <a [href]="profile().linkedin" target="_blank">LinkedIn</a>
          @if (profile().github) { <a [href]="profile().github" target="_blank">GitHub</a> }
          <a [href]="'mailto:' + profile().email">Email</a>
          <a mat-icon-button href="#home" aria-label="Back to top"><mat-icon>arrow_upward</mat-icon></a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer { max-width: 1180px; margin: 0 auto; padding: 40px 24px 28px; border-top: 1px solid rgba(255,255,255,.08); }
    .signoff { font-size: clamp(1rem, 1.8vw, 1.25rem); font-weight: 600; letter-spacing: 0; margin: 0 0 16px; opacity: .85; text-align: center; }
    .row { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 14px; text-align: center; }
    p { color: var(--muted); margin: 0; font-size: .9rem; }
    .links { display: flex; align-items: center; gap: 22px; }
    .links a { color: var(--muted); font-weight: 500; transition: color .2s; }
    .links a:hover { color: #fff; }
    .links a[mat-icon-button] { color: #fff; background: rgba(255,255,255,.06); }
  `],
})
export class Footer {
  readonly profile = input.required<Profile>();
  readonly year = new Date().getFullYear();
}
