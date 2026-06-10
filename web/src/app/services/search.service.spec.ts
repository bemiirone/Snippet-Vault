import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    service = new SearchService();
  });

  it('should initialize with empty query', () => {
    expect(service.query()).toBe('');
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

  describe('clear', () => {
    it('should reset query to empty string', () => {
      service.setQuery('some query');
      service.clear();
      expect(service.query()).toBe('');
    });
  });
});
