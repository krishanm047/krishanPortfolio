import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Profile } from '../../models/portfolio';

@Component({
  selector: 'app-footer',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <footer>
      <div class="links">
        @if (profile().github) { <a mat-button [href]="profile().github" target="_blank">GitHub</a> }
        <a mat-button [href]="profile().linkedin" target="_blank">LinkedIn</a>
        <a mat-icon-button href="#home" aria-label="Back to top"><mat-icon>arrow_upward</mat-icon></a>
      </div>
      <p>© {{ year }} {{ profile().name }} · Built with Angular & Angular Material</p>
    </footer>
  `,
  styles: [`
    footer { text-align: center; padding: 32px 24px; border-top: 1px solid var(--mat-sys-outline-variant);
      color: var(--mat-sys-on-surface-variant); }
    .links { display: flex; justify-content: center; gap: 8px; }
  `],
})
export class Footer {
  readonly profile = input.required<Profile>();
  readonly year = new Date().getFullYear();
}
