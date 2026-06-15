import { Routes } from '@angular/router';
import { SidebarLayout } from './layout/sidebar-layout/sidebar-layout';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { LibraryPage } from './pages/library/library-page';
import { SnippetPage } from './pages/snippet/snippet-page';
import { AuthSetup } from './pages/auth-setup/auth-setup';
import { authGuard } from './guards/auth.guard';
import { configResolver } from './config/config.provider';

export const routes: Routes = [
  { path: 'setup', component: AuthSetup, resolve: { config: configResolver } },
  {
    path: '',
    component: SidebarLayout,
    canActivate: [authGuard],
    resolve: { config: configResolver },
    children: [
      { path: '', component: DashboardPage },
      { path: 'library', component: LibraryPage },
      { path: 'snippet/:id', component: SnippetPage },
      { path: 'new', component: SnippetPage },
    ]
  }
];
