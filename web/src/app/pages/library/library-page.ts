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

const LANGUAGES = ['ts', 'js', 'py', 'sh', 'json', 'yml', 'md', 'sql', 'html', 'css', 'other'];

@Component({
  selector: 'app-library-page',
  imports: [RouterLink],
  templateUrl: './library-page.html',
  styleUrl: './library-page.scss'
})
export class LibraryPage {
  protected readonly viewMode = signal<'grid' | 'list'>(localStorage.getItem('libraryView') === 'grid' ? 'grid' : 'list');
  protected readonly selectedLanguage = signal<string>('');
  protected readonly activeTags = signal<string[]>([]);
  protected readonly sortBy = signal<'newest' | 'oldest' | 'alpha'>('newest');

  protected readonly allTags = signal<string[]>(['auth', 'nestjs', 'devops', 'docker', 'regex', 'utils', 'git', 'cli', 'mongoose', 'css', 'layout', 'python', 'patterns', 'sql', 'db']);

  protected readonly snippets = signal<Snippet[]>([
    { id: '1', title: 'Auth Guard', language: 'ts', tags: ['auth', 'nestjs'], content: 'export const authGuard = () => inject(AuthService).isAuthenticated();', starred: true, createdAt: '2026-05-05' },
    { id: '2', title: 'Docker Compose', language: 'yml', tags: ['devops', 'docker'], content: 'services:\n  api:\n    build: .\n    ports:\n      - "3000:3000"', starred: false, createdAt: '2026-05-04' },
    { id: '3', title: 'Regex Email', language: 'js', tags: ['regex', 'utils'], content: 'const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;', starred: true, createdAt: '2026-05-03' },
    { id: '4', title: 'Git Aliases', language: 'sh', tags: ['git', 'cli'], content: 'alias gs="git status"\nalias gc="git commit"', starred: false, createdAt: '2026-05-02' },
    { id: '5', title: 'Mongoose Schema', language: 'ts', tags: ['mongoose', 'nestjs'], content: '@Schema()\nexport class User {\n  @Prop() name: string;\n}', starred: false, createdAt: '2026-05-01' },
    { id: '6', title: 'CSS Grid Layout', language: 'css', tags: ['css', 'layout'], content: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}', starred: true, createdAt: '2026-04-30' },
    { id: '7', title: 'Python Decorator', language: 'py', tags: ['python', 'patterns'], content: 'def timer(func):\n    def wrapper(*args):\n        return func(*args)\n    return wrapper', starred: false, createdAt: '2026-04-29' },
    { id: '8', title: 'SQL Migration', language: 'sql', tags: ['sql', 'db'], content: 'ALTER TABLE snippets ADD COLUMN starred BOOLEAN DEFAULT false;', starred: false, createdAt: '2026-04-28' },
  ]);

  protected toggleTag(tag: string): void {
    this.activeTags.update(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
    localStorage.setItem('libraryView', mode);
  }

  protected copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content);
  }

  protected get filteredSnippets(): Snippet[] {
    let result = this.snippets();

    if (this.selectedLanguage()) {
      result = result.filter(s => s.language === this.selectedLanguage());
    }

    const tags = this.activeTags();
    if (tags.length > 0) {
      result = result.filter(s => tags.some(t => s.tags.includes(t)));
    }

    const sort = this.sortBy();
    if (sort === 'oldest') {
      result = [...result].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    } else if (sort === 'alpha') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return result;
  }
}
