import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly _query = signal('');

  get query() {
    return this._query.asReadonly();
  }

  setQuery(value: string): void {
    this._query.set(value);
  }

  clear(): void {
    this._query.set('');
  }
}
