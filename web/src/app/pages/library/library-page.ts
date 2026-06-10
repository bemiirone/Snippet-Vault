import { Component, signal, inject, computed, effect, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { SearchService } from '../../services/search.service';
import { Snippet } from '../../models/snippet.model';
import { filterSnippets } from '../../utils/filter-snippets';
import { SnippetCard } from '../../shared/snippet-card/snippet-card';

@Component({
  selector: 'app-library-page',
  imports: [RouterLink, SnippetCard],
  templateUrl: './library-page.html',
  styleUrl: './library-page.scss'
})
export class LibraryPage {
  private readonly snippetService = inject(SnippetService);
  protected readonly searchService = inject(SearchService);

  protected readonly viewMode = signal<'grid' | 'list'>(localStorage.getItem('libraryView') === 'grid' ? 'grid' : 'list');
  protected readonly selectedLanguage = signal<string>('');
  protected readonly activeTags = signal<string[]>([]);
  protected readonly sortBy = signal<'newest' | 'oldest' | 'alpha'>('newest');

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly allSnippets = signal<Snippet[]>([]);
  protected readonly allTags = signal<string[]>([]);

  protected readonly displaySnippets = computed<Snippet[]>(() =>
    filterSnippets(this.allSnippets(), this.searchService.query())
  );

  constructor() {
    effect(() => {
      const _lang = this.selectedLanguage();
      const _tags = this.activeTags();
      const _sort = this.sortBy();
      untracked(() => this.loadSnippets());
    });
  }

  protected async loadSnippets(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const tags = this.activeTags().join(',');
      const snippets = await this.snippetService.getAll({
        tags: tags || undefined,
        programmingLanguage: this.selectedLanguage() || undefined,
        sort: this.sortBy(),
        limit: 50,
      });

      this.allSnippets.set(snippets);

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
}
