import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { Snippet, SnippetStats } from '../../models/snippet.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {
  private readonly snippetService = inject(SnippetService);

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly stats = signal<SnippetStats>({ total: 0, topLanguages: [], topTags: [] });
  protected readonly recentSnippets = signal<Snippet[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const [stats, snippets] = await Promise.all([
        this.snippetService.getStats(),
        this.snippetService.getAll({ limit: 8 }),
      ]);
      this.stats.set(stats);
      this.recentSnippets.set(snippets);
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
