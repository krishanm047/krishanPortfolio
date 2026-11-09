import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactMessage, Profile } from '../../models/portfolio';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatSnackBarModule],
  template: `
    <section id="contact" class="section">
      <h2 class="section-title">Contact</h2>
      <p class="section-subtitle">Have a question or opportunity? Send me a message.</p>
      <form [formGroup]="form" (ngSubmit)="submit(fgd)" #fgd="ngForm" class="form">
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
        <div class="actions">
          <a mat-button [href]="'mailto:' + profile().email"><mat-icon>mail</mat-icon> {{ profile().email }}</a>
          <button mat-flat-button type="submit"><mat-icon>send</mat-icon> Send message
          </button>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; max-width: 760px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .actions { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
    @media (max-width: 600px) { .row { grid-template-columns: 1fr; } }
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
