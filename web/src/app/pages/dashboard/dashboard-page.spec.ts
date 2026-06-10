import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPage } from './dashboard-page';
import { SnippetStore } from '../../services/snippet.store';
import { SearchService } from '../../services/search.service';
import { SnippetService } from '../../services/snippet.service';
import { MessageService } from 'primeng/api';
import { Snippet, SnippetStats } from '../../models/snippet.model';

describe('DashboardPage', () => {
  let storeMock: { load: ReturnType<typeof vi.fn>; refresh: ReturnType<typeof vi.fn>; snippets: ReturnType<typeof vi.fn>; loading: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn>; loaded: ReturnType<typeof vi.fn>; stats: ReturnType<typeof vi.fn> };
  let searchServiceMock: { query: ReturnType<typeof vi.fn> };
  let snippetServiceMock: { exportAll: ReturnType<typeof vi.fn> };
  let messageServiceMock: { add: ReturnType<typeof vi.fn> };

  const mockSnippets: Snippet[] = [
    {
      _id: '1',
      id: '1',
      title: 'Test Snippet',
      content: 'console.log("test")',
      programmingLanguage: 'typescript',
      tags: ['test'],
      starred: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  const mockStats: SnippetStats = {
    total: 1,
    topLanguages: [],
    topTags: [],
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    storeMock = {
      load: vi.fn().mockResolvedValue(undefined),
      refresh: vi.fn().mockResolvedValue(undefined),
      snippets: vi.fn().mockReturnValue(mockSnippets),
      loading: vi.fn().mockReturnValue(false),
      error: vi.fn().mockReturnValue(''),
      loaded: vi.fn().mockReturnValue(true),
      stats: vi.fn().mockReturnValue(mockStats),
    };
    searchServiceMock = { query: vi.fn().mockReturnValue('') };
    snippetServiceMock = { exportAll: vi.fn().mockResolvedValue(mockSnippets) };
    messageServiceMock = { add: vi.fn() };

    TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        { provide: SnippetStore, useValue: storeMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: SnippetService, useValue: snippetServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call store.load', async () => {
      const fixture = TestBed.createComponent(DashboardPage);
      await fixture.componentInstance.ngOnInit();
      expect(storeMock.load).toHaveBeenCalled();
    });
  });

  describe('onSavedOrDeleted', () => {
    it('should call store.refresh', async () => {
      const fixture = TestBed.createComponent(DashboardPage);
      await fixture.componentInstance.onSavedOrDeleted();
      expect(storeMock.refresh).toHaveBeenCalled();
    });
  });

  describe('exportAll', () => {
    it('should show error message on export failure', async () => {
      snippetServiceMock.exportAll.mockRejectedValue(new Error('Export failed'));
      const fixture = TestBed.createComponent(DashboardPage);
      await fixture.componentInstance.exportAll();
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Export failed',
      });
    });
  });
});
