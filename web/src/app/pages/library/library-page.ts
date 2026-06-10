import { Component, signal, inject, computed, effect, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnippetStore } from '../../services/snippet.store';
import { SearchService } from '../../services/search.service';
import { Snippet } from '../../models/snippet.model';
import { filterSnippets } from '../../utils/filter-snippets';
import { SnippetCard } from '../../shared/snippet-card/snippet-card';
import { Paginator } from 'primeng/paginator';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { ErrorBanner } from '../../shared/error-banner/error-banner';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { LANGUAGES } from '../../constants/languages';

@Component({
  selector: 'app-library-page',
  imports: [RouterLink, SnippetCard, Paginator, LoadingState, ErrorBanner, EmptyState],
  templateUrl: './library-page.html',
  styleUrl: './library-page.scss'
})
export class LibraryPage {
  protected readonly Math = Math;
  protected readonly store = inject(SnippetStore);
  protected readonly searchService = inject(SearchService);

  protected readonly languages = LANGUAGES;
  protected readonly pageSize = 5;

  protected readonly viewMode = signal<'grid' | 'list'>(localStorage.getItem('libraryView') === 'grid' ? 'grid' : 'list');
  protected readonly selectedLanguage = signal<string>('');
  protected readonly activeTags = signal<string[]>([]);
  protected readonly sortBy = signal<'newest' | 'oldest' | 'alpha'>('newest');
  protected readonly first = signal(0);

  protected readonly filteredSnippets = computed<Snippet[]>(() =>
    filterSnippets(this.store.snippets(), this.searchService.query())
  );

  protected readonly paginatedSnippets = computed<Snippet[]>(() => {
    const start = this.first();
    return this.filteredSnippets().slice(start, start + this.pageSize);
  });

  constructor() {
    effect(() => {
      const _lang = this.selectedLanguage();
      const _tags = this.activeTags();
      const _sort = this.sortBy();
      untracked(() => {
        this.first.set(0);
        this.store.refresh();
      });
    });
  }

  async ngOnInit(): Promise<void> {
    await this.store.load();
  }

  async onSavedOrDeleted(): Promise<void> {
    await this.store.refresh();
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

  protected onPageChange(event: { first?: number }): void {
    if (event.first !== undefined) {
      this.first.set(event.first);
    }
  }
}
