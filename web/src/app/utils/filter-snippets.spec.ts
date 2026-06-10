import { filterSnippets } from './filter-snippets';
import { Snippet } from '../models/snippet.model';

const mockSnippets: Snippet[] = [
  {
    _id: '1',
    id: '1',
    title: 'Hello World in TypeScript',
    content: 'console.log("Hello World");',
    programmingLanguage: 'typescript',
    tags: ['basics', 'console'],
    starred: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '2',
    id: '2',
    title: 'Python Script',
    content: 'print("Hello Python")',
    programmingLanguage: 'python',
    tags: ['scripting', 'basics'],
    starred: true,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
  {
    _id: '3',
    id: '3',
    title: 'JavaScript Utility',
    content: 'const utils = {};',
    programmingLanguage: 'javascript',
    tags: ['utilities'],
    starred: false,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
];

describe('filterSnippets', () => {
  it('should return all snippets when query is empty', () => {
    expect(filterSnippets(mockSnippets, '')).toEqual(mockSnippets);
  });

  it('should return all snippets when query is less than 3 characters', () => {
    expect(filterSnippets(mockSnippets, 'a')).toEqual(mockSnippets);
    expect(filterSnippets(mockSnippets, 'ab')).toEqual(mockSnippets);
  });

  it('should filter by title', () => {
    const result = filterSnippets(mockSnippets, 'hello');
    expect(result).toHaveLength(2);
    expect(result.map(r => r.title)).toContain('Hello World in TypeScript');
    expect(result.map(r => r.title)).toContain('Python Script');
  });

  it('should filter by content', () => {
    const result = filterSnippets(mockSnippets, 'console');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Hello World in TypeScript');
  });

  it('should filter by tags', () => {
    const result = filterSnippets(mockSnippets, 'basics');
    expect(result).toHaveLength(2);
  });

  it('should filter by programming language', () => {
    const result = filterSnippets(mockSnippets, 'python');
    expect(result).toHaveLength(1);
    expect(result[0].programmingLanguage).toBe('python');
  });

  it('should be case insensitive', () => {
    const result = filterSnippets(mockSnippets, 'TYPESCRIPT');
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no matches', () => {
    const result = filterSnippets(mockSnippets, 'nonexistent');
    expect(result).toHaveLength(0);
  });

  it('should return empty array for empty snippets array', () => {
    expect(filterSnippets([], 'test')).toEqual([]);
  });
});
