import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <mat-toolbar class="toolbar">
      <a class="brand" href="#home">KM<span>.</span></a>
      <span class="spacer"></span>
      <nav class="desktop">
        @for (l of links; track l.id) { <a mat-button [href]="'#' + l.id">{{ l.label }}</a> }
      </nav>
      <button mat-icon-button (click)="toggleTheme()" [matTooltip]="dark() ? 'Light mode' : 'Dark mode'">
        <mat-icon>{{ dark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
      <button mat-icon-button class="mobile" [matMenuTriggerFor]="menu" aria-label="Menu"><mat-icon>menu</mat-icon></button>
      <mat-menu #menu="matMenu">
        @for (l of links; track l.id) { <a mat-menu-item [href]="'#' + l.id">{{ l.label }}</a> }
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    /* Dark gradient header, readable over the animated background */
    .toolbar {
      position: sticky; top: 0; z-index: 50;
      --mat-toolbar-container-background-color: transparent;
      --mat-toolbar-container-text-color: #1e293b;
      color: #1e293b;
      background: linear-gradient(90deg, rgba(255, 255, 255, .85), rgba(241, 245, 249, .85), rgba(255, 255, 255, .85)) !important;
      backdrop-filter: blur(16px) saturate(160%);
      -webkit-backdrop-filter: blur(16px) saturate(160%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, .06), 0 2px 18px color-mix(in srgb, var(--accent-1) 45%, transparent);
      border-bottom: 1px solid transparent;
      border-image: linear-gradient(90deg, var(--accent-3), var(--accent-1), var(--accent-2)) 1;
    }
    :host-context(body.dark-theme) .toolbar {
      --mat-toolbar-container-text-color: #fff; color: #fff;
      background: linear-gradient(90deg, rgba(15, 23, 42, .92), rgba(30, 41, 59, .92), rgba(15, 23, 42, .92)) !important;
    }
    :host-context(body.dark-theme) .toolbar a, :host-context(body.dark-theme) .toolbar button,
    :host-context(body.dark-theme) .brand { color: #fff !important; }
    /* White nav links and icons on the dark bar */
    .toolbar a, .toolbar button { color: #334155 !important; }
    .toolbar a:hover, .toolbar button:hover { color: var(--accent-1) !important; }
    .brand { font-weight: 800; font-size: 1.4rem; text-decoration: none; color: #1e293b !important;
      span { color: var(--accent-1); } }
    .spacer { flex: 1; }
    .mobile { display: none; }
    @media (max-width: 800px) { .desktop { display: none; } .mobile { display: inline-flex; } }
  `],
})
export class Header {
  private readonly doc = inject(DOCUMENT);
  readonly dark = signal(localStorage.getItem('theme') === 'dark');
  readonly links = [
    { id: 'about', label: 'About' }, { id: 'skills', label: 'Skills' }, { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' }, { id: 'contact', label: 'Contact' },
  ];

  constructor() { this.apply(); }

  toggleTheme(): void {
    this.dark.update(d => !d);
    localStorage.setItem('theme', this.dark() ? 'dark' : 'light');
    this.apply();
  }

  private apply(): void { this.doc.body.classList.toggle('dark-theme', this.dark()); }
}
