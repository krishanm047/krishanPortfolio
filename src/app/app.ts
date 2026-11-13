import { Component, afterNextRender, inject } from '@angular/core';
import { PortfolioService } from './services/portfolio.service';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Skills } from './components/skills/skills';
import { ExperienceSection } from './components/experience/experience';
import { Projects } from './components/projects/projects';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';
import { Particles } from './components/particles/particles';
import { setupScrollReveal } from './directives/scroll-reveal';

@Component({
  selector: 'app-root',
  imports: [Particles, Header, Hero, About, Skills, ExperienceSection, Projects, Contact, Footer],
  template: `
    <!-- Decorative background layers -->
    <div class="bg-layer" aria-hidden="true">
      <span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span>
      <span class="grid-overlay"></span>
    </div>
    <app-particles />
    <div class="scroll-progress" aria-hidden="true"></div>

    @let data = portfolio();
    <app-header />
    <main>
      <app-hero [data]="data" />
      <app-about [profile]="data.profile" [education]="data.education" />
      <app-skills [skills]="data.skills" />
      <app-experience [items]="data.experience" />
      <app-projects [projects]="data.projects" />
      <app-contact [profile]="data.profile" />
    </main>
    <app-footer [profile]="data.profile" />
  `,
})
export class App {
  readonly portfolio = inject(PortfolioService).portfolio;

  constructor() {
    setupScrollReveal();
    // Feed mouse position to .glass cards for the spotlight effect
    afterNextRender(() => {
      document.addEventListener('pointermove', e => {
        const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('.glass');
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      }, { passive: true });
    });
  }
}
