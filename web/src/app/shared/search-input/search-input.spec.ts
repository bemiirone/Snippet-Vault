import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SearchInput } from './search-input';
import { SearchService } from '../../services/search.service';

describe('SearchInput', () => {
  let searchServiceMock: { setQuery: ReturnType<typeof vi.fn>; clear: ReturnType<typeof vi.fn>; query: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    TestBed.resetTestingModule();
    searchServiceMock = {
      setQuery: vi.fn(),
      clear: vi.fn(),
      query: vi.fn().mockReturnValue(''),
    };

    TestBed.configureTestingModule({
      imports: [SearchInput],
      providers: [{ provide: SearchService, useValue: searchServiceMock }],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SearchInput);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call searchService.clear on destroy', () => {
    const fixture = TestBed.createComponent(SearchInput);
    fixture.componentInstance.ngOnDestroy();
    expect(searchServiceMock.clear).toHaveBeenCalled();
  });
});
