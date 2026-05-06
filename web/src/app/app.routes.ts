import { Routes } from '@angular/router';
import { SidebarLayout } from './layout/sidebar-layout/sidebar-layout';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { LibraryPage } from './pages/library/library-page';
import { SnippetPage } from './pages/snippet/snippet-page';

export const routes: Routes = [
  {
    path: '',
    component: SidebarLayout,
    children: [
      { path: '', component: DashboardPage },
      { path: 'library', component: LibraryPage },
      { path: 'snippet/:id', component: SnippetPage },
      { path: 'new', component: SnippetPage },
    ]
  }
];
