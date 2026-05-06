import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.scss'
})
export class SidebarLayout {
  protected readonly sidebarOpen = signal(false);
  protected readonly theme = signal<'dark' | 'light'>('dark');
  protected readonly searchQuery = signal('');

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  protected toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}
