import { routes } from './app.routes';
import { SidebarLayout } from './layout/sidebar-layout/sidebar-layout';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { LibraryPage } from './pages/library/library-page';
import { SnippetPage } from './pages/snippet/snippet-page';
import { AuthSetup } from './pages/auth-setup/auth-setup';
import { authGuard } from './guards/auth.guard';

describe('routes', () => {
  it('should have setup route without guard', () => {
    const setupRoute = routes.find(r => r.path === 'setup');
    expect(setupRoute).toBeDefined();
    expect(setupRoute?.component).toBe(AuthSetup);
    expect(setupRoute?.canActivate).toBeUndefined();
  });

  it('should have root route with SidebarLayout and authGuard', () => {
    const rootRoute = routes.find(r => r.path === '');
    expect(rootRoute).toBeDefined();
    expect(rootRoute?.component).toBe(SidebarLayout);
    expect(rootRoute?.canActivate).toContain(authGuard);
  });

  it('should have dashboard as child of root', () => {
    const rootRoute = routes.find(r => r.path === '');
    const dashboardRoute = rootRoute?.children?.find(r => r.path === '');
    expect(dashboardRoute?.component).toBe(DashboardPage);
  });

  it('should have library route', () => {
    const rootRoute = routes.find(r => r.path === '');
    const libraryRoute = rootRoute?.children?.find(r => r.path === 'library');
    expect(libraryRoute?.component).toBe(LibraryPage);
  });

  it('should have snippet route with id param', () => {
    const rootRoute = routes.find(r => r.path === '');
    const snippetRoute = rootRoute?.children?.find(r => r.path === 'snippet/:id');
    expect(snippetRoute?.component).toBe(SnippetPage);
  });

  it('should have new snippet route', () => {
    const rootRoute = routes.find(r => r.path === '');
    const newRoute = rootRoute?.children?.find(r => r.path === 'new');
    expect(newRoute?.component).toBe(SnippetPage);
  });

  it('should have correct number of routes', () => {
    expect(routes).toHaveLength(2);
  });

  it('should have correct number of child routes', () => {
    const rootRoute = routes.find(r => r.path === '');
    expect(rootRoute?.children).toHaveLength(4);
  });
});
