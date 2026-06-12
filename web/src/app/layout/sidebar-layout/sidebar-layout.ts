import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SearchInput } from '../../shared/search-input/search-input';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-sidebar-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, SearchInput, Toast, ConfirmDialog],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.scss'
})
export class SidebarLayout {
  protected readonly searchService = inject(SearchService);
  protected readonly sidebarOpen = signal(false);
  protected readonly theme = signal<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark'
  );

  constructor() {
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  protected toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', this.theme());
    localStorage.setItem('theme', this.theme());
  }

  protected clearSearch(): void {
    this.searchService.clearAll();
  }
}
