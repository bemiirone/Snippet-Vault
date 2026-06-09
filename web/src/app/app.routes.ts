import { Routes } from '@angular/router';
import { SidebarLayout } from './layout/sidebar-layout/sidebar-layout';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { LibraryPage } from './pages/library/library-page';
import { SnippetPage } from './pages/snippet/snippet-page';
import { AuthSetup } from './pages/auth-setup/auth-setup';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'setup', component: AuthSetup },
  {
    path: '',
    component: SidebarLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardPage },
      { path: 'library', component: LibraryPage },
      { path: 'snippet/:id', component: SnippetPage },
      { path: 'new', component: SnippetPage },
    ]
  }
];
