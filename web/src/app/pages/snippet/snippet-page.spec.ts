import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { SnippetPage } from './snippet-page';
import { SnippetService } from '../../services/snippet.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Snippet } from '../../models/snippet.model';

describe('SnippetPage', () => {
  let snippetServiceMock: { getById: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
  let messageServiceMock: { add: ReturnType<typeof vi.fn> };
  let confirmationServiceMock: { confirm: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let routeMock: { snapshot: { paramMap: { get: ReturnType<typeof vi.fn> } } };

  const mockSnippet: Snippet = {
    _id: '1',
    id: '1',
    title: 'Test Snippet',
    content: 'console.log("test")',
    programmingLanguage: 'typescript',
    tags: ['test', 'typescript'],
    starred: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    snippetServiceMock = {
      getById: vi.fn(),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    };
    messageServiceMock = { add: vi.fn() };
    confirmationServiceMock = { confirm: vi.fn() };
    routerMock = { navigate: vi.fn() };
    routeMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(null),
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [SnippetPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: Router, useValue: routerMock },
        { provide: SnippetService, useValue: snippetServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SnippetPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize as new snippet when no id', async () => {
    const fixture = TestBed.createComponent(SnippetPage);
    await fixture.componentInstance.ngOnInit();
    expect(fixture.componentInstance['isNew']()).toBe(true);
  });

  describe('cancel', () => {
    it('should navigate to library', () => {
      const fixture = TestBed.createComponent(SnippetPage);
      fixture.componentInstance['cancel']();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/library']);
    });
  });
});
