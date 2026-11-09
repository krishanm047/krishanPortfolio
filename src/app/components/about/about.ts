import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Education, Profile } from '../../models/portfolio';

@Component({
  selector: 'app-about',
  imports: [MatCardModule, MatIconModule],
  template: `
    <section id="about" class="section">
      <h2 class="section-title">About me</h2>
      <p class="section-subtitle">A quick introduction</p>
      <div class="layout">
        <p class="summary">{{ profile().summary }}</p>
        <div class="facts">
          <mat-card appearance="outlined"><mat-card-content>
            <div class="fact"><mat-icon>place</mat-icon>{{ profile().location }}</div>
            <div class="fact"><mat-icon>mail</mat-icon><a [href]="'mailto:' + profile().email">{{ profile().email }}</a></div>
            @if (profile().yearsOfExperience > 0) {
              <div class="fact"><mat-icon>timeline</mat-icon>{{ profile().yearsOfExperience }}+ years experience</div>
            }
            @for (e of education(); track e.institution) {
              <div class="fact"><mat-icon>school</mat-icon>{{ e.degree }}, {{ e.institution }} ({{ e.period }})</div>
            }
          </mat-card-content></mat-card>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .layout { display: grid; grid-template-columns: 3fr 2fr; gap: 32px; align-items: start; }
    .summary { font-size: 1.1rem; line-height: 1.8; margin: 0; }
    .fact { display: flex; align-items: center; gap: 12px; padding: 8px 0;
      mat-icon { color: var(--mat-sys-primary); } }
    @media (max-width: 800px) { .layout { grid-template-columns: 1fr; } }
  `],
})
export class About {
  readonly profile = input.required<Profile>();
  readonly education = input<Education[]>([]);
}
