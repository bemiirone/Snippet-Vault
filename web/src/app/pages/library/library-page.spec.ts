import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LibraryPage } from './library-page';
import { SnippetStore } from '../../services/snippet.store';
import { SearchService } from '../../services/search.service';
import { Snippet, SnippetStats } from '../../models/snippet.model';

describe('LibraryPage', () => {
  let storeMock: { load: ReturnType<typeof vi.fn>; refresh: ReturnType<typeof vi.fn>; snippets: ReturnType<typeof vi.fn>; loading: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn>; loaded: ReturnType<typeof vi.fn>; stats: ReturnType<typeof vi.fn> };
  let searchServiceMock: {
    query: ReturnType<typeof vi.fn>;
    selectedLanguage: ReturnType<typeof vi.fn>;
    activeTags: ReturnType<typeof vi.fn>;
    sortBy: ReturnType<typeof vi.fn>;
    toggleTag: ReturnType<typeof vi.fn>;
    setLanguage: ReturnType<typeof vi.fn>;
    setSortBy: ReturnType<typeof vi.fn>;
  };
  let storageMock: Storage;

  const mockSnippets: Snippet[] = [
    {
      _id: '1',
      id: '1',
      title: 'Alpha Snippet',
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
      title: 'Beta Snippet',
      content: 'code 2',
      programmingLanguage: 'javascript',
      tags: ['js', 'test'],
      starred: true,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
    {
      _id: '3',
      id: '3',
      title: 'Gamma Snippet',
      content: 'code 3',
      programmingLanguage: 'python',
      tags: ['python'],
      starred: false,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03',
    },
  ];

  const mockStats: SnippetStats = {
    total: 3,
    topLanguages: [],
    topTags: [],
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    storageMock = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    vi.stubGlobal('localStorage', storageMock);

    storeMock = {
      load: vi.fn().mockResolvedValue(undefined),
      refresh: vi.fn().mockResolvedValue(undefined),
      snippets: vi.fn().mockReturnValue(mockSnippets),
      loading: vi.fn().mockReturnValue(false),
      error: vi.fn().mockReturnValue(''),
      loaded: vi.fn().mockReturnValue(true),
      stats: vi.fn().mockReturnValue(mockStats),
    };
    searchServiceMock = {
      query: vi.fn().mockReturnValue(''),
      selectedLanguage: vi.fn().mockReturnValue(''),
      activeTags: vi.fn().mockReturnValue([]),
      sortBy: vi.fn().mockReturnValue('newest'),
      toggleTag: vi.fn(),
      setLanguage: vi.fn(),
      setSortBy: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [LibraryPage],
      providers: [
        provideRouter([]),
        { provide: SnippetStore, useValue: storeMock },
        { provide: SearchService, useValue: searchServiceMock },
      ],
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LibraryPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call store.load', async () => {
      const fixture = TestBed.createComponent(LibraryPage);
      await fixture.componentInstance.ngOnInit();
      expect(storeMock.load).toHaveBeenCalled();
    });
  });

  describe('onSavedOrDeleted', () => {
    it('should call store.refresh', async () => {
      const fixture = TestBed.createComponent(LibraryPage);
      await fixture.componentInstance.onSavedOrDeleted();
      expect(storeMock.refresh).toHaveBeenCalled();
    });
  });

  describe('toggleTag', () => {
    it('should call searchService.toggleTag', () => {
      const fixture = TestBed.createComponent(LibraryPage);
      fixture.componentInstance['toggleTag']('test');
      expect(searchServiceMock.toggleTag).toHaveBeenCalledWith('test');
    });
  });
});
