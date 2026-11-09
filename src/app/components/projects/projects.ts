import { Component, computed, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Project } from '../../models/portfolio';

@Component({
  selector: 'app-projects',
  imports: [MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, MatButtonToggleModule],
  template: `
    <section id="projects" class="section">
      <h2 class="section-title">Projects</h2>
      <p class="section-subtitle">Things I've built</p>

      <!-- Filter projects by technology -->
      <mat-button-toggle-group [value]="filter()" (change)="filter.set($event.value)" class="filters" hideSingleSelectionIndicator>
        <mat-button-toggle value="All">All</mat-button-toggle>
        @for (t of techs(); track t) { <mat-button-toggle [value]="t">{{ t }}</mat-button-toggle> }
      </mat-button-toggle-group>

      <div class="grid">
        @for (p of filtered(); track p.name) {
          <mat-card appearance="outlined" class="card">
            <mat-card-header>
              <mat-icon mat-card-avatar class="icon">{{ p.icon }}</mat-icon>
              <mat-card-title>{{ p.name }}</mat-card-title>
              <mat-card-subtitle>{{ p.status }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ p.description }}</p>
              <mat-chip-set>@for (t of p.tech; track t) { <mat-chip>{{ t }}</mat-chip> }</mat-chip-set>
            </mat-card-content>
            <mat-card-actions align="end">
              @if (p.repoUrl) { <a mat-button [href]="p.repoUrl" target="_blank"><mat-icon>code</mat-icon> Code</a> }
              @if (p.demoUrl) { <a mat-flat-button [href]="p.demoUrl" target="_blank"><mat-icon>open_in_new</mat-icon> Demo</a> }
            </mat-card-actions>
          </mat-card>
        } @empty { <p>No projects for this filter.</p> }
      </div>
    </section>
  `,
  styles: [`
    .filters { margin-bottom: 32px; flex-wrap: wrap; }
    .card { height: 100%; display: flex; flex-direction: column; transition: transform .2s, box-shadow .2s; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.12); }
    mat-card-content { flex: 1; }
    .icon { color: var(--mat-sys-primary); display: grid; place-items: center; }
    p { line-height: 1.6; }
  `],
})
export class Projects {
  readonly projects = input.required<Project[]>();
  readonly filter = signal('All');
  readonly techs = computed(() => [...new Set(this.projects().flatMap(p => p.tech))].slice(0, 6));
  readonly filtered = computed(() =>
    this.filter() === 'All' ? this.projects() : this.projects().filter(p => p.tech.includes(this.filter())));
}
