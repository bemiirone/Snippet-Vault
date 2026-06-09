import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-setup',
  template: `
    <div class="auth-setup">
      <div class="auth-card">
        <h1>SnippetVault</h1>
        <p class="subtitle">Enter your API key to continue</p>

        <form (submit)="submit()">
          <input
            class="input"
            type="password"
            placeholder="sk_..."
            [value]="key()"
            (input)="key.set($any($event.target).value)"
            autofocus
          />

          @if (error()) {
            <p class="error">{{ error() }}</p>
          }

          <button class="btn btn-primary w-full" type="submit" [disabled]="!key()">
            Connect
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-setup {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .auth-card {
      width: 100%;
      max-width: 360px;
      padding: var(--spacing-xl);
    }

    .auth-card h1 {
      margin: 0 0 var(--spacing-sm);
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
    }

    .subtitle {
      margin: 0 0 var(--spacing-lg);
      color: var(--text-secondary);
      font-size: 0.875rem;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .error {
      margin: 0;
      color: var(--danger);
      font-size: 0.8125rem;
      text-align: center;
    }
  `]
})
export class AuthSetup {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly key = signal('');
  protected readonly error = signal('');

  protected async submit(): Promise<void> {
    const value = this.key().trim();
    if (!value) return;

    this.auth.setKey(value);
    this.router.navigate(['/']);
  }
}
