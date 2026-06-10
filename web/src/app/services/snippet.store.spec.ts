import { TestBed } from '@angular/core/testing';
import { SnippetStore } from './snippet.store';
import { SnippetService } from './snippet.service';
import { Snippet, SnippetStats } from '../models/snippet.model';

describe('SnippetStore', () => {
  let store: SnippetStore;
  let snippetServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
    getStats: ReturnType<typeof vi.fn>;
    getById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    exportAll: ReturnType<typeof vi.fn>;
  };

  const mockSnippets: Snippet[] = [
    {
      _id: '1',
      id: '1',
      title: 'Snippet 1',
      content: 'code 1',
      programmingLanguage: 'typescript',
      tags: ['ts', 'test'],
      starred: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      _id: '2',
      id: '2',
      title: 'Snippet 2',
      content: 'code 2',
      programmingLanguage: 'javascript',
      tags: ['js', 'test'],
      starred: true,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
  ];

  const mockStats: SnippetStats = {
    total: 2,
    topLanguages: [{ language: 'typescript', count: 1 }],
    topTags: [{ tag: 'test', count: 2 }],
  };

  beforeEach(() => {
    snippetServiceMock = {
      getAll: vi.fn(),
      getStats: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      exportAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SnippetStore,
        { provide: SnippetService, useValue: snippetServiceMock },
      ],
    });

    store = TestBed.inject(SnippetStore);
  });

  it('should initialize with default values', () => {
    expect(store.snippets()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('');
    expect(store.loaded()).toBe(false);
    expect(store.stats()).toEqual({ total: 0, topLanguages: [], topTags: [] });
  });

  describe('allTags', () => {
    it('should compute unique sorted tags from snippets', async () => {
      snippetServiceMock.getStats.mockResolvedValue(mockStats);
      snippetServiceMock.getAll.mockResolvedValue(mockSnippets);

      await store.refresh();

      const tags = store.allTags();
      expect(tags).toEqual(['js', 'test', 'ts']);
    });

    it('should return empty array when no snippets', () => {
      expect(store.allTags()).toEqual([]);
    });
  });

  describe('load', () => {
    it('should load data when not loaded', async () => {
      snippetServiceMock.getStats.mockResolvedValue(mockStats);
      snippetServiceMock.getAll.mockResolvedValue(mockSnippets);

      await store.load();

      expect(snippetServiceMock.getStats).toHaveBeenCalled();
      expect(snippetServiceMock.getAll).toHaveBeenCalledWith({ limit: 200, sort: 'newest' });
      expect(store.loaded()).toBe(true);
      expect(store.snippets()).toHaveLength(2);
    });

    it('should not reload if already loaded', async () => {
      snippetServiceMock.getStats.mockResolvedValue(mockStats);
      snippetServiceMock.getAll.mockResolvedValue(mockSnippets);

      await store.load();
      snippetServiceMock.getStats.mockClear();
      snippetServiceMock.getAll.mockClear();

      await store.load();

      expect(snippetServiceMock.getStats).not.toHaveBeenCalled();
      expect(snippetServiceMock.getAll).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should set loading state during refresh', async () => {
      snippetServiceMock.getStats.mockResolvedValue(mockStats);
      snippetServiceMock.getAll.mockResolvedValue(mockSnippets);

      const loadingPromise = store.refresh();
      expect(store.loading()).toBe(true);

      await loadingPromise;
      expect(store.loading()).toBe(false);
    });

    it('should update snippets and stats on success', async () => {
      snippetServiceMock.getStats.mockResolvedValue(mockStats);
      snippetServiceMock.getAll.mockResolvedValue(mockSnippets);

      await store.refresh();

      expect(store.snippets()).toEqual(mockSnippets);
      expect(store.stats()).toEqual(mockStats);
      expect(store.loaded()).toBe(true);
      expect(store.error()).toBe('');
    });

    it('should set error on failure', async () => {
      snippetServiceMock.getStats.mockRejectedValue(new Error('Network error'));
      snippetServiceMock.getAll.mockRejectedValue(new Error('Network error'));

      await store.refresh();

      expect(store.error()).toBe('Network error');
      expect(store.loading()).toBe(false);
    });

    it('should set fallback error for non-Error objects', async () => {
      snippetServiceMock.getStats.mockRejectedValue('string error');
      snippetServiceMock.getAll.mockRejectedValue('string error');

      await store.refresh();

      expect(store.error()).toBe('Failed to load snippets');
    });

    it('should clear error before refresh', async () => {
      store['_error'].set('previous error');
      snippetServiceMock.getStats.mockResolvedValue(mockStats);
      snippetServiceMock.getAll.mockResolvedValue(mockSnippets);

      await store.refresh();

      expect(store.error()).toBe('');
    });
  });

  describe('invalidate', () => {
    it('should set loaded to false', async () => {
      snippetServiceMock.getStats.mockResolvedValue(mockStats);
      snippetServiceMock.getAll.mockResolvedValue(mockSnippets);

      await store.load();
      expect(store.loaded()).toBe(true);

      store.invalidate();
      expect(store.loaded()).toBe(false);
    });
  });
});
