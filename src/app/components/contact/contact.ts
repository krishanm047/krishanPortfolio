import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactMessage, Profile } from '../../models/portfolio';
import { PortfolioService } from '../../services/portfolio.service';

/** Contact: CTA panel with direct links next to a validated glass form (sends via mailto). */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <section id="contact" class="section">
      <div class="wrap">
        <div class="intro" data-reveal>
          <span class="eyebrow">05 · Contact</span>
          <h2>Let's build something <span class="grad">great together</span></h2>
          <p>Have a role, project or idea in mind? My inbox is open, and I usually reply within a day.</p>
          <a class="glass link" [href]="'mailto:' + profile().email">
            <mat-icon>mail</mat-icon><div><small>Email</small>{{ profile().email }}</div><mat-icon class="arrow">north_east</mat-icon>
          </a>
          <a class="glass link" [href]="profile().linkedin" target="_blank">
            <mat-icon>language</mat-icon><div><small>LinkedIn</small>krishanm047</div><mat-icon class="arrow">north_east</mat-icon>
          </a>
          <div class="glass link static">
            <mat-icon>place</mat-icon><div><small>Based in</small>{{ profile().location }}</div>
          </div>
        </div>

        <form class="glass form" [formGroup]="form" (ngSubmit)="submit(fgd)" #fgd="ngForm" data-reveal>
          <div class="row">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" autocomplete="name">
              @if (form.controls.name.hasError('required')) { <mat-error>Name is required</mat-error> }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email">
              @if (form.controls.email.hasError('email')) { <mat-error>Enter a valid email</mat-error> }
              @else if (form.controls.email.hasError('required')) { <mat-error>Email is required</mat-error> }
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline">
            <mat-label>Subject</mat-label>
            <input matInput formControlName="subject">
            @if (form.controls.subject.hasError('required')) { <mat-error>Subject is required</mat-error> }
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Message</mat-label>
            <textarea matInput rows="6" formControlName="message"></textarea>
            <mat-hint align="end">{{ form.controls.message.value.length }} / 2000</mat-hint>
            @if (form.controls.message.hasError('minlength')) { <mat-error>At least 10 characters</mat-error> }
            @else if (form.controls.message.hasError('required')) { <mat-error>Message is required</mat-error> }
          </mat-form-field>
          <button mat-flat-button class="btn-grad send" type="submit"><mat-icon>send</mat-icon> Send message</button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .wrap { display: grid; grid-template-columns: 1fr 1.15fr; gap: 48px; align-items: start; }
    h2 { font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 800; letter-spacing: -.03em; margin: 12px 0; }
    .intro p { color: var(--muted); line-height: 1.7; margin: 0 0 28px; }
    .link { display: flex; align-items: center; gap: 16px; padding: 16px 20px; margin-bottom: 14px; color: var(--text); border-radius: 18px; }
    .link > mat-icon:first-child { color: var(--accent-2); }
    .link div { flex: 1; word-break: break-word; }
    .link small { display: block; color: var(--muted); font-size: .72rem; text-transform: uppercase; letter-spacing: .1em; }
    .arrow { color: var(--muted); transition: transform .3s; }
    .link:hover .arrow { transform: translate(3px, -3px); color: #fff; }
    .static:hover { transform: none; }
    .form { padding: 32px; display: flex; flex-direction: column; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .send { align-self: flex-end; margin-top: 8px; }
    @media (max-width: 900px) { .wrap { grid-template-columns: 1fr; } }
    @media (max-width: 600px) { .row { grid-template-columns: 1fr; } .send { align-self: stretch; } }
  `],
})
export class Contact {
  readonly profile = input.required<Profile>();
  private readonly api = inject(PortfolioService);
  private readonly snack = inject(MatSnackBar);

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.maxLength(150)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  submit(fgd: FormGroupDirective): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.api.sendMessage(this.profile().email, this.form.getRawValue() as ContactMessage);
    this.snack.open('Opening your email app...', 'OK', { duration: 3000 });
    fgd.resetForm();
    this.form.reset();
  }
}
