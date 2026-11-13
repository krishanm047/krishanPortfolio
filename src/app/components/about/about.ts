import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Education, Profile } from '../../models/portfolio';

/** About: summary card, quick facts and an education timeline in a bento layout. */
@Component({
  selector: 'app-about',
  imports: [MatIconModule],
  template: `
    <section id="about" class="section">
      <div class="sec-head" data-reveal>
        <span class="eyebrow">01 · About</span>
        <h2>Engineering <span class="grad">enterprise software</span> that lasts</h2>
      </div>
      <div class="bento">
        <div class="glass card summary" data-reveal>
          <mat-icon class="quote">format_quote</mat-icon>
          <p>{{ profile().summary }}</p>
        </div>
        <div class="glass card facts" data-reveal>
          <div class="fact"><mat-icon>place</mat-icon><div><small>Location</small>{{ profile().location }}</div></div>
          <div class="fact"><mat-icon>mail</mat-icon><div><small>Email</small>
            <a [href]="'mailto:' + profile().email">{{ profile().email }}</a></div></div>
          <div class="fact"><mat-icon>work_history</mat-icon><div><small>Experience</small>{{ profile().yearsOfExperience }}+ years at DXC Technology</div></div>
          <div class="fact"><mat-icon>language</mat-icon><div><small>LinkedIn</small>
            <a [href]="profile().linkedin" target="_blank">linkedin.com/in/krishanm047</a></div></div>
        </div>
        <div class="glass card edu" data-reveal>
          <h3><mat-icon>school</mat-icon> Education</h3>
          @for (e of education(); track e.institution) {
            <div class="edu-item">
              <span class="period">{{ e.period }}</span>
              <strong>{{ e.degree }}</strong>
              <span class="inst">{{ e.institution }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .bento { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; }
    .card { padding: 32px; }
    .summary { grid-row: span 2; }
    .summary p { font-size: 1.15rem; line-height: 1.85; color: #d4d4ea; margin: 0; }
    .quote { font-size: 48px; width: 48px; height: 48px; color: var(--accent-1); opacity: .7; }
    .fact { display: flex; gap: 14px; align-items: center; padding: 10px 0; word-break: break-word; }
    .fact mat-icon { flex: none; width: 42px; height: 42px; font-size: 22px; display: grid; place-items: center; border-radius: 12px;
      color: var(--accent-2); background: rgba(34, 211, 238, .1); }
    .fact small { display: block; color: var(--muted); font-size: .75rem; text-transform: uppercase; letter-spacing: .1em; }
    h3 { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; font-size: 1.1rem; }
    h3 mat-icon { color: var(--accent-1); }
    .edu-item { position: relative; padding: 0 0 16px 20px; border-left: 2px solid rgba(255,255,255,.08); display: flex; flex-direction: column; gap: 2px; }
    .edu-item::before { content: ''; position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; border-radius: 50%;
      background: var(--grad); box-shadow: 0 0 10px var(--accent-1); }
    .period { color: var(--accent-2); font-size: .8rem; font-weight: 600; }
    .inst { color: var(--muted); font-size: .9rem; }
    @media (max-width: 860px) { .bento { grid-template-columns: 1fr; } .summary { grid-row: auto; } }
  `],
})
export class About {
  readonly profile = input.required<Profile>();
  readonly education = input<Education[]>([]);
}
