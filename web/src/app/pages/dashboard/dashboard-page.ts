import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Snippet {
  id: string;
  title: string;
  language: string;
  tags: string[];
  content: string;
  starred: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage {
  protected readonly stats = signal({
    total: 42,
    topLanguage: 'TypeScript',
    topTag: 'nestjs'
  });

  protected readonly recentSnippets = signal<Snippet[]>([
    { id: '1', title: 'Auth Guard', language: 'ts', tags: ['auth', 'nestjs'], content: 'export const authGuard = () => inject(AuthService).isAuthenticated();', starred: true, createdAt: '2026-05-05' },
    { id: '2', title: 'Docker Compose', language: 'yml', tags: ['devops', 'docker'], content: 'services:\n  api:\n    build: .\n    ports:\n      - "3000:3000"', starred: false, createdAt: '2026-05-04' },
    { id: '3', title: 'Regex Email', language: 'js', tags: ['regex', 'utils'], content: 'const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;', starred: true, createdAt: '2026-05-03' },
    { id: '4', title: 'Git Aliases', language: 'sh', tags: ['git', 'cli'], content: 'alias gs="git status"\nalias gc="git commit"', starred: false, createdAt: '2026-05-02' },
    { id: '5', title: 'Mongoose Schema', language: 'ts', tags: ['mongoose', 'nestjs'], content: '@Schema()\nexport class User {\n  @Prop() name: string;\n}', starred: false, createdAt: '2026-05-01' },
    { id: '6', title: 'CSS Grid Layout', language: 'css', tags: ['css', 'layout'], content: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}', starred: true, createdAt: '2026-04-30' },
    { id: '7', title: 'Python Decorator', language: 'py', tags: ['python', 'patterns'], content: 'def timer(func):\n    def wrapper(*args):\n        return func(*args)\n    return wrapper', starred: false, createdAt: '2026-04-29' },
    { id: '8', title: 'SQL Migration', language: 'sql', tags: ['sql', 'db'], content: 'ALTER TABLE snippets ADD COLUMN starred BOOLEAN DEFAULT false;', starred: false, createdAt: '2026-04-28' },
  ]);

  protected copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content);
  }
}
