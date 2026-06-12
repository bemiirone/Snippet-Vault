import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnippetStore } from '../../services/snippet.store';
import { SearchService } from '../../services/search.service';
import { SnippetService } from '../../services/snippet.service';
import { Snippet } from '../../models/snippet.model';
import { filterSnippets } from '../../utils/filter-snippets';
import { extractErrorMessage } from '../../utils/helpers';
import { SnippetCard } from '../../shared/snippet-card/snippet-card';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { ErrorBanner } from '../../shared/error-banner/error-banner';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, SnippetCard, LoadingState, ErrorBanner, EmptyState],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {
  protected readonly store = inject(SnippetStore);
  private readonly snippetService = inject(SnippetService);
  private readonly messageService = inject(MessageService);
  protected readonly searchService = inject(SearchService);

  protected readonly displaySnippets = computed<Snippet[]>(() => {
    const filtered = filterSnippets(this.store.snippets(), this.searchService.query());
    const isSearching = this.searchService.query().length >= 3;
    return isSearching ? filtered : filtered.slice(0, 3);
  });

  async ngOnInit(): Promise<void> {
    await this.store.load();
  }

  async onSavedOrDeleted(): Promise<void> {
    await this.store.refresh();
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: extractErrorMessage(err, 'Failed to export snippets') });
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
        const dtos = snippets.map(s => ({
          title: String(s['title'] ?? ''),
          content: String(s['content'] ?? ''),
          programmingLanguage: String(s['programmingLanguage'] ?? 'other'),
          tags: Array.isArray(s['tags']) ? s['tags'] : [],
          starred: Boolean(s['starred']),
        }));
        await this.snippetService.importAll(dtos);
        await this.store.refresh();
        this.messageService.add({ severity: 'success', summary: 'Imported', detail: 'Snippets imported successfully' });
      } catch (err: unknown) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: extractErrorMessage(err, 'Failed to import snippets') });
      }
    };
    input.click();
  }
}
