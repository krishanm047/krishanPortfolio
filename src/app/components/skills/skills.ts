import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SkillGroup } from '../../models/portfolio';

@Component({
  selector: 'app-skills',
  imports: [MatCardModule, MatChipsModule, MatIconModule],
  template: `
    <section id="skills" class="section">
      <h2 class="section-title">Skills</h2>
      <p class="section-subtitle">Technologies I work with</p>
      <div class="grid">
        @for (g of skills(); track g.category) {
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-icon mat-card-avatar class="icon">{{ g.icon }}</mat-icon>
              <mat-card-title>{{ g.category }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-chip-set aria-label="{{ g.category }} skills">
                @for (s of g.items; track s) { <mat-chip>{{ s }}</mat-chip> }
              </mat-chip-set>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </section>
  `,
  styles: [`
    mat-card { height: 100%; }
    mat-card-content { padding-top: 16px; }
    .icon { color: var(--mat-sys-primary); display: grid; place-items: center; }
  `],
})
export class Skills {
  readonly skills = input.required<SkillGroup[]>();
}
