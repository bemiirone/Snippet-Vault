import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { SearchService } from '../../services/search.service';
import { Snippet, SnippetStats } from '../../models/snippet.model';
import { filterSnippets } from '../../utils/filter-snippets';
import { extractErrorMessage } from '../../utils/helpers';
import { SnippetCard } from '../../shared/snippet-card/snippet-card';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { ErrorBanner } from '../../shared/error-banner/error-banner';
import { EmptyState } from '../../shared/empty-state/empty-state';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, SnippetCard, LoadingState, ErrorBanner, EmptyState],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {
  private readonly snippetService = inject(SnippetService);
  protected readonly searchService = inject(SearchService);

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly stats = signal<SnippetStats>({ total: 0, topLanguages: [], topTags: [] });
  protected readonly allSnippets = signal<Snippet[]>([]);

  protected readonly displaySnippets = computed<Snippet[]>(() =>
    filterSnippets(this.allSnippets(), this.searchService.query())
  );

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      const [stats, snippets] = await Promise.all([
        this.snippetService.getStats(),
        this.snippetService.getAll({ limit: 3, sort: 'newest' }),
      ]);
      this.stats.set(stats);
      this.allSnippets.set(snippets);
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Failed to load data');
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  async exportAll(): Promise<void> {
    try {
      const snippets = await this.snippetService.exportAll();
      const blob = new Blob([JSON.stringify(snippets, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snippets-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      this.error.set(extractErrorMessage(err, 'Failed to export snippets'));
    }
  }

  async importJson(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const snippets = JSON.parse(text) as Array<Record<string, unknown>>;
        for (const s of snippets) {
          await this.snippetService.create({
            title: String(s['title'] ?? ''),
            content: String(s['content'] ?? ''),
            programmingLanguage: String(s['programmingLanguage'] ?? 'other'),
            tags: Array.isArray(s['tags']) ? s['tags'] : [],
            starred: Boolean(s['starred']),
          });
        }
        await this.loadData();
      } catch (err: unknown) {
        this.error.set(extractErrorMessage(err, 'Failed to import snippets'));
      }
    };
    input.click();
  }
}
