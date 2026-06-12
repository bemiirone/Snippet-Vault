import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly _query = signal('');
  private readonly _selectedLanguage = signal('');
  private readonly _activeTags = signal<string[]>([]);
  private readonly _sortBy = signal<'newest' | 'oldest' | 'alpha'>('newest');

  get query() {
    return this._query.asReadonly();
  }

  get selectedLanguage() {
    return this._selectedLanguage.asReadonly();
  }

  get activeTags() {
    return this._activeTags.asReadonly();
  }

  get sortBy() {
    return this._sortBy.asReadonly();
  }

  get hasActiveFilters() {
    return computed(() =>
      this._query() !== '' ||
      this._selectedLanguage() !== '' ||
      this._activeTags().length > 0 ||
      this._sortBy() !== 'newest'
    );
  }

  setQuery(value: string): void {
    this._query.set(value);
  }

  setLanguage(value: string): void {
    this._selectedLanguage.set(value);
  }

  setSortBy(value: 'newest' | 'oldest' | 'alpha'): void {
    this._sortBy.set(value);
  }

  toggleTag(tag: string): void {
    this._activeTags.update(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  clear(): void {
    this._query.set('');
  }

  clearAll(): void {
    this._query.set('');
    this._selectedLanguage.set('');
    this._activeTags.set([]);
    this._sortBy.set('newest');
  }
}
