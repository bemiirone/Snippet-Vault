import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    service = new SearchService();
  });

  it('should initialize with empty query', () => {
    expect(service.query()).toBe('');
  });

  it('should initialize with empty language', () => {
    expect(service.selectedLanguage()).toBe('');
  });

  it('should initialize with empty tags', () => {
    expect(service.activeTags()).toEqual([]);
  });

  it('should initialize with newest sort', () => {
    expect(service.sortBy()).toBe('newest');
  });

  describe('setQuery', () => {
    it('should update the query signal', () => {
      service.setQuery('test query');
      expect(service.query()).toBe('test query');
    });

    it('should accept empty string', () => {
      service.setQuery('something');
      service.setQuery('');
      expect(service.query()).toBe('');
    });
  });

  describe('setLanguage', () => {
    it('should update the language signal', () => {
      service.setLanguage('typescript');
      expect(service.selectedLanguage()).toBe('typescript');
    });
  });

  describe('setSortBy', () => {
    it('should update the sortBy signal', () => {
      service.setSortBy('oldest');
      expect(service.sortBy()).toBe('oldest');
    });
  });

  describe('toggleTag', () => {
    it('should add tag when not present', () => {
      service.toggleTag('test');
      expect(service.activeTags()).toContain('test');
    });

    it('should remove tag when present', () => {
      service.toggleTag('test');
      service.toggleTag('test');
      expect(service.activeTags()).not.toContain('test');
    });
  });

  describe('clear', () => {
    it('should reset query to empty string', () => {
      service.setQuery('some query');
      service.clear();
      expect(service.query()).toBe('');
    });
  });

  describe('clearAll', () => {
    it('should reset all filters to defaults', () => {
      service.setQuery('query');
      service.setLanguage('typescript');
      service.toggleTag('test');
      service.setSortBy('oldest');

      service.clearAll();

      expect(service.query()).toBe('');
      expect(service.selectedLanguage()).toBe('');
      expect(service.activeTags()).toEqual([]);
      expect(service.sortBy()).toBe('newest');
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false when no filters are set', () => {
      expect(service.hasActiveFilters()).toBe(false);
    });

    it('should return true when query is set', () => {
      service.setQuery('test');
      expect(service.hasActiveFilters()).toBe(true);
    });

    it('should return true when language is set', () => {
      service.setLanguage('typescript');
      expect(service.hasActiveFilters()).toBe(true);
    });

    it('should return true when tags are set', () => {
      service.toggleTag('test');
      expect(service.hasActiveFilters()).toBe(true);
    });

    it('should return true when sort is not newest', () => {
      service.setSortBy('oldest');
      expect(service.hasActiveFilters()).toBe(true);
    });
  });
});
