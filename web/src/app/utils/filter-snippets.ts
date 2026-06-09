import { Snippet } from '../models/snippet.model';

export function filterSnippets(snippets: Snippet[], query: string): Snippet[] {
  if (query.length < 3) {
    return snippets;
  }

  const lowerQuery = query.toLowerCase();
  return snippets.filter(s =>
    s.title.toLowerCase().includes(lowerQuery) ||
    s.content.toLowerCase().includes(lowerQuery) ||
    s.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
    s.programmingLanguage.toLowerCase().includes(lowerQuery)
  );
}
