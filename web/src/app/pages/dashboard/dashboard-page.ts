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

  protected readonly displaySnippets = computed<Snippet[]>(() => {
    const filtered = filterSnippets(this.allSnippets(), this.searchService.query());
    if (this.searchService.query().length < 3) {
      return filtered.slice(0, 3);
    }
    return filtered;
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      const [stats, snippets] = await Promise.all([
        this.snippetService.getStats(),
        this.snippetService.getAll({ limit: 50, sort: 'newest' }),
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
}
