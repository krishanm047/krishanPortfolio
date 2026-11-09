import { Injectable, signal } from '@angular/core';
import { ContactMessage, Portfolio } from '../models/portfolio';
import { PORTFOLIO } from '../data/portfolio.data';

/** Serves static portfolio content - no backend required. */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  readonly portfolio = signal<Portfolio>(PORTFOLIO).asReadonly();

  /** Opens the visitor's email client with the message pre-filled. */
  sendMessage(to: string, msg: ContactMessage): void {
    const body = `${msg.message}\n\n- ${msg.name} (${msg.email})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(body)}`;
  }
}
