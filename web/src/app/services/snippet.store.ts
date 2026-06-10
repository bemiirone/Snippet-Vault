import { Injectable, signal, computed, inject } from '@angular/core';
import { SnippetService } from './snippet.service';
import { Snippet, SnippetStats } from '../models/snippet.model';

@Injectable({ providedIn: 'root' })
export class SnippetStore {
  private readonly snippetService = inject(SnippetService);

  private readonly _snippets = signal<Snippet[]>([]);
  private readonly _stats = signal<SnippetStats>({ total: 0, topLanguages: [], topTags: [] });
  private readonly _loading = signal(false);
  private readonly _error = signal('');
  private readonly _loaded = signal(false);

  readonly snippets = this._snippets.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  readonly allTags = computed<string[]>(() => {
    const tagSet = new Set<string>();
    this._snippets().forEach(s => s.tags.forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
  });

  async load(): Promise<void> {
    if (this._loaded()) return;
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this._loading.set(true);
    this._error.set('');

    try {
      const [stats, snippets] = await Promise.all([
        this.snippetService.getStats(),
        this.snippetService.getAll({ limit: 200, sort: 'newest' }),
      ]);
      this._stats.set(stats);
      this._snippets.set(snippets);
      this._loaded.set(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load snippets';
      this._error.set(message);
    } finally {
      this._loading.set(false);
    }
  }

  invalidate(): void {
    this._loaded.set(false);
  }
}
