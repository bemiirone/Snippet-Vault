import { Component, signal, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

const LANGUAGES = ['ts', 'js', 'py', 'sh', 'json', 'yml', 'md', 'sql', 'html', 'css', 'other'];

@Component({
  selector: 'app-snippet-page',
  imports: [RouterLink],
  templateUrl: './snippet-page.html',
  styleUrl: './snippet-page.scss'
})
export class SnippetPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly languages = LANGUAGES;
  protected readonly isNew = signal(true);
  protected readonly title = signal('');
  protected readonly language = signal('ts');
  protected readonly tagsInput = signal('');
  protected readonly content = signal('');
  protected readonly starred = signal(false);

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isNew.set(false);
        this.title.set('Auth Guard');
        this.language.set('ts');
        this.tagsInput.set('auth, nestjs');
        this.content.set('export const authGuard = () => inject(AuthService).isAuthenticated();');
        this.starred.set(true);
      } else {
        this.isNew.set(true);
        this.title.set('');
        this.language.set('ts');
        this.tagsInput.set('');
        this.content.set('');
        this.starred.set(false);
      }
    });
  }

  protected parseTags(): string[] {
    return this.tagsInput()
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);
  }

  protected save(): void {
    if (!this.title() || !this.content()) {
      return;
    }
    this.router.navigate(['/library']);
  }

  protected cancel(): void {
    this.router.navigate(['/library']);
  }

  protected delete(): void {
    this.router.navigate(['/library']);
  }

  protected copyRaw(): void {
    navigator.clipboard.writeText(this.content());
  }
}
