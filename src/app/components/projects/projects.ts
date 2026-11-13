import { Component, computed, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Project } from '../../models/portfolio';

/** Projects: filterable grid; the first project is shown as a large featured card. */
@Component({
  selector: 'app-projects',
  imports: [MatButtonModule, MatIconModule, MatButtonToggleModule],
  template: `
    <section id="projects" class="section">
      <div class="sec-head" data-reveal>
        <span class="eyebrow">04 · Projects</span>
        <h2>Selected <span class="grad">work</span></h2>
      </div>

      <mat-button-toggle-group class="filters" [value]="filter()" (change)="filter.set($event.value)" hideSingleSelectionIndicator data-reveal>
        <mat-button-toggle value="All">All</mat-button-toggle>
        @for (t of techs(); track t) { <mat-button-toggle [value]="t">{{ t }}</mat-button-toggle> }
      </mat-button-toggle-group>

      <div class="grid">
        @for (p of filtered(); track p.name; let i = $index) {
          <article class="glass card" [class.featured]="i === 0 && filter() === 'All'">
            <div class="top">
              <span class="icon"><mat-icon>{{ p.icon }}</mat-icon></span>
              <span class="status">{{ p.status }}</span>
            </div>
            <span class="idx">0{{ i + 1 }}</span>
            <h3>{{ p.name }}</h3>
            <p>{{ p.description }}</p>
            <div class="tags">@for (t of p.tech; track t) { <span class="tag">{{ t }}</span> }</div>
            @if (p.repoUrl || p.demoUrl) {
              <div class="links">
                @if (p.repoUrl) { <a mat-button [href]="p.repoUrl" target="_blank"><mat-icon>code</mat-icon> Code</a> }
                @if (p.demoUrl) { <a mat-flat-button class="btn-grad" [href]="p.demoUrl" target="_blank"><mat-icon>open_in_new</mat-icon> Live</a> }
              </div>
            }
          </article>
        } @empty { <p class="empty">No projects for this filter.</p> }
      </div>
    </section>
  `,
  styles: [`
    .filters { margin-bottom: 32px; flex-wrap: wrap; border-radius: 999px !important;
      --mat-standard-button-toggle-shape: 999px; --mat-standard-button-toggle-background-color: rgba(255,255,255,.03);
      --mat-standard-button-toggle-selected-state-background-color: color-mix(in srgb, var(--accent-1) 35%, transparent);
      --mat-standard-button-toggle-divider-color: rgba(255,255,255,.08); border-color: rgba(255,255,255,.1) !important; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .card { padding: 30px; display: flex; flex-direction: column; gap: 14px; min-height: 280px; }
    .card.featured { grid-column: span 2;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 16%, transparent), color-mix(in srgb, var(--accent-2) 8%, transparent)); }
    .card.featured h3 { font-size: 1.8rem; }
    .top { display: flex; justify-content: space-between; align-items: center; }
    .icon { width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; background: var(--grad);
      box-shadow: 0 10px 30px -10px var(--accent-1); }
    .icon mat-icon { color: #fff; }
    .status { font-size: .75rem; font-weight: 600; padding: 5px 12px; border-radius: 999px; color: var(--accent-2);
      border: 1px solid color-mix(in srgb, var(--accent-2) 35%, transparent); }
    .idx { position: absolute; right: 26px; bottom: 6px; font-size: 6rem; font-weight: 900; line-height: 1;
      color: rgba(255,255,255,.035); pointer-events: none; }
    h3 { margin: 6px 0 0; font-size: 1.35rem; letter-spacing: -.02em; }
    p { margin: 0; color: #c4c4dc; line-height: 1.7; flex: 1; }
    .links { display: flex; gap: 10px; justify-content: flex-end; }
    .empty { color: var(--muted); }
    @media (max-width: 800px) { .grid { grid-template-columns: 1fr; } .card.featured { grid-column: auto; } }
  `],
})
export class Projects {
  readonly projects = input.required<Project[]>();
  readonly filter = signal('All');
  readonly techs = computed(() => [...new Set(this.projects().flatMap(p => p.tech))].slice(0, 6));
  readonly filtered = computed(() =>
    this.filter() === 'All' ? this.projects() : this.projects().filter(p => p.tech.includes(this.filter())));
}
