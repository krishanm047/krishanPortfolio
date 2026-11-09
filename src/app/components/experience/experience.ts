import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Experience } from '../../models/portfolio';

@Component({
  selector: 'app-experience',
  imports: [MatCardModule, MatChipsModule],
  template: `
    <section id="experience" class="section">
      <h2 class="section-title">Experience</h2>
      <p class="section-subtitle">Where I've worked</p>
      <div class="timeline">
        @for (x of items(); track x.company + x.role) {
          <div class="item">
            <span class="dot"></span>
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title>{{ x.role }}</mat-card-title>
                <mat-card-subtitle>{{ x.company }} · {{ x.period }} · {{ x.location }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                @if (x.highlights.length) { <ul>@for (h of x.highlights; track h) { <li>{{ h }}</li> }</ul> }
                <mat-chip-set>@for (t of x.tech; track t) { <mat-chip>{{ t }}</mat-chip> }</mat-chip-set>
              </mat-card-content>
            </mat-card>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .timeline { position: relative; padding-left: 32px; border-left: 2px solid var(--mat-sys-outline-variant); }
    .item { position: relative; margin-bottom: 24px; }
    .dot { position: absolute; left: -42px; top: 24px; width: 18px; height: 18px; border-radius: 50%;
      background: var(--mat-sys-primary); border: 3px solid var(--mat-sys-surface); }
    ul { line-height: 1.7; padding-left: 20px; }
  `],
})
export class ExperienceSection {
  readonly items = input.required<Experience[]>();
}
