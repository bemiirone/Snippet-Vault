import { Component, signal, inject, OnDestroy } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss'
})
export class SearchInput implements OnDestroy {
  protected readonly searchService = inject(SearchService);
  protected readonly placeholder = signal('Search snippets...');

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setQuery(value);
  }

  ngOnDestroy(): void {
    this.searchService.clear();
  }
}
