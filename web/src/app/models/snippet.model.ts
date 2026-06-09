export interface Snippet {
  _id: string;
  id: string;
  title: string;
  content: string;
  programmingLanguage: string;
  tags: string[];
  starred: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SnippetStats {
  total: number;
  topLanguages: { language: string; count: number }[];
  topTags: { tag: string; count: number }[];
}

export interface CreateSnippetDto {
  title: string;
  content: string;
  programmingLanguage: string;
  tags?: string[];
  starred?: boolean;
}

export interface UpdateSnippetDto {
  title?: string;
  content?: string;
  programmingLanguage?: string;
  tags?: string[];
  starred?: boolean;
}

export interface QuerySnippetDto {
  q?: string;
  tags?: string;
  programmingLanguage?: string;
  sort?: 'newest' | 'oldest' | 'alpha';
  limit?: number;
}
