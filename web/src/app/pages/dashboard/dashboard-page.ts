import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { SearchService } from '../../services/search.service';
import { Snippet, SnippetStats } from '../../models/snippet.model';
import { filterSnippets } from '../../utils/filter-snippets';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
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
    try {
      const [stats, snippets] = await Promise.all([
        this.snippetService.getStats(),
        this.snippetService.getAll({ limit: 50, sort: 'newest' }),
      ]);
      this.stats.set(stats);
      this.allSnippets.set(snippets);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  protected copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content);
  }
}
