import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SearchInput } from '../../shared/search-input/search-input';

@Component({
  selector: 'app-sidebar-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, SearchInput],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.scss'
})
export class SidebarLayout {
  protected readonly sidebarOpen = signal(false);
  protected readonly theme = signal<'dark' | 'light'>('dark');

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  protected toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', this.theme());
  }
}
