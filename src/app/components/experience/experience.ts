import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Experience } from '../../models/portfolio';

/** Experience: glowing vertical timeline of glass cards; current roles get a live badge. */
@Component({
  selector: 'app-experience',
  imports: [MatIconModule],
  template: `
    <section id="experience" class="section">
      <div class="sec-head" data-reveal>
        <span class="eyebrow">03 · Experience</span>
        <h2>Where I've <span class="grad">built &amp; grown</span></h2>
      </div>
      <div class="timeline">
        @for (x of items(); track x.role) {
          <div class="item" data-reveal>
            <span class="node"><mat-icon>work</mat-icon></span>
            <div class="glass card">
              <div class="top">
                <div>
                  <h3>{{ x.role }}</h3>
                  <span class="company">{{ x.company }} · {{ x.location }}</span>
                </div>
                <span class="period" [class.live]="x.period.includes('Present')">
                  @if (x.period.includes('Present')) { <span class="dot"></span> }
                  {{ x.period }}
                </span>
              </div>
              @if (x.highlights.length) {
                <ul>@for (h of x.highlights; track h) { <li>{{ h }}</li> }</ul>
              }
              @if (x.tech.length) {
                <div class="tags">@for (t of x.tech; track t) { <span class="tag">{{ t }}</span> }</div>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .timeline { position: relative; padding-left: 64px; }
    .timeline::before { content: ''; position: absolute; left: 21px; top: 0; bottom: 0; width: 2px;
      background: linear-gradient(var(--accent-1), var(--accent-2), transparent); }
    .item { position: relative; margin-bottom: 24px; }
    .node { position: absolute; left: -64px; top: 22px; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
      background: var(--bg); border: 2px solid var(--accent-1); box-shadow: 0 0 20px color-mix(in srgb, var(--accent-1) 60%, transparent); }
    .node mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--accent-2); }
    .card { padding: 26px 28px; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
    h3 { margin: 0 0 4px; font-size: 1.2rem; }
    .company { color: var(--muted); font-size: .9rem; }
    .period { display: inline-flex; align-items: center; gap: 8px; font-size: .8rem; font-weight: 600; padding: 6px 12px;
      border-radius: 999px; color: var(--muted); border: 1px solid rgba(255,255,255,.1); white-space: nowrap; }
    .period.live { color: #6ee7b7; border-color: rgba(52,211,153,.35); background: rgba(52,211,153,.08); }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399; }
    ul { margin: 18px 0; padding: 0; list-style: none; display: grid; gap: 10px; }
    li { position: relative; padding-left: 22px; color: #cfcfe6; line-height: 1.6; }
    li::before { content: ''; position: absolute; left: 0; top: .6em; width: 8px; height: 8px; border-radius: 2px;
      background: var(--grad); transform: rotate(45deg); }
    .tags { margin-top: 14px; }
    @media (max-width: 600px) { .timeline { padding-left: 0; } .timeline::before, .node { display: none; } }
  `],
})
export class ExperienceSection {
  readonly items = input.required<Experience[]>();
}
