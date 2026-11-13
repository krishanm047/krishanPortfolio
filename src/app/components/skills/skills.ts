import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SkillGroup } from '../../models/portfolio';

/** Skills: bento grid of glass tiles; the first two tiles are wide. */
@Component({
  selector: 'app-skills',
  imports: [MatIconModule],
  template: `
    <section id="skills" class="section">
      <div class="sec-head" data-reveal>
        <span class="eyebrow">02 · Skills</span>
        <h2>My <span class="grad">tech stack</span></h2>
        <p>Tools and technologies I use to design, build, test and ship enterprise applications.</p>
      </div>
      <div class="bento">
        @for (g of skills(); track g.category; let i = $index) {
          <div class="glass tile" [class.wide]="i < 2" data-reveal>
            <div class="head">
              <span class="icon"><mat-icon>{{ g.icon }}</mat-icon></span>
              <h3>{{ g.category }}</h3>
              <span class="count">{{ g.items.length }}</span>
            </div>
            <div class="tags">@for (s of g.items; track s) { <span class="tag">{{ s }}</span> }</div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .tile { padding: 26px; display: flex; flex-direction: column; gap: 18px; }
    .tile.wide { grid-column: span 2; }
    .head { display: flex; align-items: center; gap: 12px; }
    .icon { width: 46px; height: 46px; border-radius: 14px; display: grid; place-items: center;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 30%, transparent), color-mix(in srgb, var(--accent-2) 20%, transparent));
      border: 1px solid rgba(255,255,255,.1); }
    .icon mat-icon { color: #fff; }
    h3 { margin: 0; font-size: 1.05rem; flex: 1; }
    .count { font-size: .75rem; color: var(--muted); padding: 3px 9px; border-radius: 999px; border: 1px solid rgba(255,255,255,.1); }
    @media (max-width: 1000px) { .bento { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .bento { grid-template-columns: 1fr; } .tile.wide { grid-column: auto; } }
  `],
})
export class Skills {
  readonly skills = input.required<SkillGroup[]>();
}
