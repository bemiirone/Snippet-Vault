import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SnippetService } from './snippet.service';
import { Snippet, SnippetStats } from '../models/snippet.model';

describe('SnippetService', () => {
  let service: SnippetService;
  let httpMock: HttpTestingController;

  const mockSnippet: Snippet = {
    _id: '1',
    id: '1',
    title: 'Test Snippet',
    content: 'console.log("test")',
    programmingLanguage: 'typescript',
    tags: ['test'],
    starred: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockStats: SnippetStats = {
    total: 10,
    topLanguages: [{ language: 'typescript', count: 5 }],
    topTags: [{ tag: 'test', count: 3 }],
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        SnippetService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SnippetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    it('should fetch all snippets without query params', async () => {
      const promise = service.getAll();
      const req = httpMock.expectOne('/api/snippets');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys()).toEqual([]);
      req.flush([mockSnippet]);
      const result = await promise;
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Snippet');
    });

    it('should send query params when provided', async () => {
      const promise = service.getAll({ q: 'test', tags: 'typescript', programmingLanguage: 'ts', sort: 'newest', limit: 10 });
      const req = httpMock.expectOne((request) => request.url === '/api/snippets');
      expect(req.request.params.get('q')).toBe('test');
      expect(req.request.params.get('tags')).toBe('typescript');
      expect(req.request.params.get('programmingLanguage')).toBe('ts');
      expect(req.request.params.get('sort')).toBe('newest');
      expect(req.request.params.get('limit')).toBe('10');
      req.flush([]);
      await promise;
    });
  });

  describe('getById', () => {
    it('should fetch a snippet by id', async () => {
      const promise = service.getById('1');
      const req = httpMock.expectOne('/api/snippets/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockSnippet);
      const result = await promise;
      expect(result.title).toBe('Test Snippet');
    });
  });

  describe('create', () => {
    it('should create a new snippet', async () => {
      const dto = { title: 'New', content: 'code', programmingLanguage: 'ts' };
      const promise = service.create(dto);
      const req = httpMock.expectOne('/api/snippets');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockSnippet);
      const result = await promise;
      expect(result.title).toBe('Test Snippet');
    });
  });

  describe('update', () => {
    it('should update a snippet', async () => {
      const dto = { title: 'Updated' };
      const promise = service.update('1', dto);
      const req = httpMock.expectOne('/api/snippets/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      req.flush(mockSnippet);
      const result = await promise;
      expect(result).toEqual(mockSnippet);
    });
  });

  describe('delete', () => {
    it('should delete a snippet', async () => {
      const promise = service.delete('1');
      const req = httpMock.expectOne('/api/snippets/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
      await promise;
    });
  });

  describe('getStats', () => {
    it('should fetch snippet stats', async () => {
      const promise = service.getStats();
      const req = httpMock.expectOne('/api/snippets/stats');
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
      const result = await promise;
      expect(result.total).toBe(10);
    });
  });

  describe('exportAll', () => {
    it('should export all snippets', async () => {
      const promise = service.exportAll();
      const req = httpMock.expectOne('/api/export/json');
      expect(req.request.method).toBe('GET');
      req.flush([mockSnippet]);
      const result = await promise;
      expect(result).toHaveLength(1);
    });
  });
});
