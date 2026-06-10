import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SnippetCard } from './snippet-card';
import { SnippetService } from '../../services/snippet.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Snippet } from '../../models/snippet.model';

vi.mock('highlight.js/lib/common', () => ({
  default: {
    highlight: vi.fn().mockReturnValue({ value: '<span>code</span>' }),
    registerAliases: vi.fn(),
  },
}));

describe('SnippetCard', () => {
  let snippetServiceMock: { update: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
  let messageServiceMock: { add: ReturnType<typeof vi.fn> };
  let confirmationServiceMock: { confirm: ReturnType<typeof vi.fn> };

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
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    };
    messageServiceMock = { add: vi.fn() };
    confirmationServiceMock = { confirm: vi.fn() };

    TestBed.configureTestingModule({
      imports: [SnippetCard],
      providers: [
        provideRouter([]),
        { provide: SnippetService, useValue: snippetServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SnippetCard);
    (fixture.componentInstance as any).snippet = mockSnippet;
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('copyToClipboard', () => {
    it('should call clipboard API', () => {
      const writeTextMock = vi.fn();
      vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });

      const fixture = TestBed.createComponent(SnippetCard);
      fixture.componentInstance.copyToClipboard('test content');

      expect(writeTextMock).toHaveBeenCalledWith('test content');
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Copied',
        detail: 'Snippet copied to clipboard',
      });

      vi.unstubAllGlobals();
    });
  });
});
