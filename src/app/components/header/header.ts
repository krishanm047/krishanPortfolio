import { Component, HostListener, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

/** Floating glass "pill" navbar that tightens up once the page is scrolled. */
@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <header class="nav" [class.scrolled]="scrolled()">
      <a class="brand" href="#home" aria-label="Krishan Murari - home"><img class="logo" src="/media/logo.svg" alt="KM logo" width="40" height="40"></a>
      <nav class="links">
        @for (l of links; track l.id) { <a [href]="'#' + l.id">{{ l.label }}</a> }
      </nav>
      <a mat-flat-button class="btn-grad cta" href="#contact"><mat-icon>bolt</mat-icon> Hire me</a>
      <button mat-icon-button class="burger" [matMenuTriggerFor]="menu" aria-label="Menu"><mat-icon>menu</mat-icon></button>
      <mat-menu #menu="matMenu">
        @for (l of links; track l.id) { <a mat-menu-item [href]="'#' + l.id">{{ l.label }}</a> }
      </mat-menu>
    </header>
  `,
  styles: [`
    .nav {
      position: fixed; top: 18px; left: 50%; transform: translateX(-50%); z-index: 100;
      width: min(1100px, calc(100% - 32px)); height: 64px; padding: 0 10px 0 22px;
      display: flex; align-items: center; gap: 16px;
      background: rgba(14, 14, 28, .55); border: 1px solid rgba(255,255,255,.08); border-radius: 999px;
      backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);
      transition: all .35s ease;
    }
    .nav.scrolled { top: 10px; background: rgba(10, 10, 22, .82); box-shadow: 0 12px 40px -12px rgba(0,0,0,.7); }
    .brand { display: flex; align-items: center; gap: 4px; }
    .logo { display: block; width: 40px; height: 40px; transition: transform .4s ease, filter .4s ease;
      filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent-1) 45%, transparent)); }
    .brand:hover .logo { transform: rotate(30deg) scale(1.06);
      filter: drop-shadow(0 0 14px var(--accent-1)) drop-shadow(0 0 22px color-mix(in srgb, var(--accent-2) 60%, transparent)); }
    .links { flex: 1; display: flex; justify-content: center; gap: 4px; }
    .links a { color: var(--muted); font-weight: 500; font-size: .92rem; padding: 8px 16px; border-radius: 999px; transition: all .25s; }
    .links a:hover { color: #fff; background: rgba(255,255,255,.07); }
    .cta { height: 44px !important; }
    .burger { display: none; color: #fff; margin-left: auto; }
    @media (max-width: 860px) { .links, .cta { display: none; } .burger { display: inline-flex; } }
  `],
})
export class Header {
  readonly scrolled = signal(false);
  readonly links = [
    { id: 'about', label: 'About' }, { id: 'skills', label: 'Skills' }, { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' }, { id: 'contact', label: 'Contact' },
  ];
  @HostListener('window:scroll') onScroll(): void { this.scrolled.set(window.scrollY > 40); }
}
