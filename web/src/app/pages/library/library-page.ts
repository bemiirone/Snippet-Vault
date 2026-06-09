import { Component, signal, inject, effect, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { Snippet } from '../../models/snippet.model';

@Component({
  selector: 'app-library-page',
  imports: [RouterLink],
  templateUrl: './library-page.html',
  styleUrl: './library-page.scss'
})
export class LibraryPage {
  private readonly snippetService = inject(SnippetService);

  protected readonly viewMode = signal<'grid' | 'list'>(localStorage.getItem('libraryView') === 'grid' ? 'grid' : 'list');
  protected readonly selectedLanguage = signal<string>('');
  protected readonly activeTags = signal<string[]>([]);
  protected readonly sortBy = signal<'newest' | 'oldest' | 'alpha'>('newest');
  protected readonly searchQuery = signal<string>('');

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly snippets = signal<Snippet[]>([]);
  protected readonly allTags = signal<string[]>([]);

  constructor() {
    effect(() => {
      const _lang = this.selectedLanguage();
      const _tags = this.activeTags();
      const _sort = this.sortBy();
      const _search = this.searchQuery();
      untracked(() => this.loadSnippets());
    });
  }

  private async loadSnippets(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const tags = this.activeTags().join(',');
      const snippets = await this.snippetService.getAll({
        q: this.searchQuery() || undefined,
        tags: tags || undefined,
        language: this.selectedLanguage() || undefined,
        sort: this.sortBy(),
        limit: 50,
      });

      this.snippets.set(snippets);

      const tagSet = new Set<string>();
      snippets.forEach(s => s.tags.forEach(t => tagSet.add(t)));
      this.allTags.set([...tagSet].sort());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load snippets';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  protected toggleTag(tag: string): void {
    this.activeTags.update(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
    localStorage.setItem('libraryView', mode);
  }

  protected copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content);
  }
}
