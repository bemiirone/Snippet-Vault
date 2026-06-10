import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `<div class="loading" role="status">{{ message() }}</div>`,
  styles: [`
    .loading {
      display: flex;
      justify-content: center;
      padding: var(--spacing-xl);
      color: var(--text-muted);
    }
  `]
})
export class LoadingState {
  readonly message = input('Loading...');
}
