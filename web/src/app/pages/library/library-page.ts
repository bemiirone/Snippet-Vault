import { Component, signal, inject, computed, effect } from '@angular/core';
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
  protected readonly first = signal(0);

  protected readonly filteredSnippets = computed<Snippet[]>(() => {
    let results = filterSnippets(this.store.snippets(), this.searchService.query());

    const lang = this.searchService.selectedLanguage();
    if (lang) {
      results = results.filter(s => s.programmingLanguage === lang);
    }

    const tags = this.searchService.activeTags();
    if (tags.length > 0) {
      results = results.filter(s => tags.every(t => s.tags.includes(t)));
    }

    if (this.searchService.sortBy() === 'oldest') {
      results = [...results].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (this.searchService.sortBy() === 'alpha') {
      results = [...results].sort((a, b) => a.title.localeCompare(b.title));
    }

    return results;
  });

  protected readonly paginatedSnippets = computed<Snippet[]>(() => {
    const start = this.first();
    return this.filteredSnippets().slice(start, start + this.pageSize);
  });

  constructor() {
    effect(() => {
      const _lang = this.searchService.selectedLanguage();
      const _tags = this.searchService.activeTags();
      const _sort = this.searchService.sortBy();
      this.first.set(0);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.store.load();
  }

  async onSavedOrDeleted(): Promise<void> {
    await this.store.refresh();
  }

  protected toggleTag(tag: string): void {
    this.searchService.toggleTag(tag);
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
