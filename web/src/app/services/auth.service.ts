import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'vault_api_key';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _hasKey = signal(false);

  constructor() {
    this._hasKey.set(!!localStorage.getItem(STORAGE_KEY));
  }

  hasKey(): boolean {
    return this._hasKey();
  }

  getKey(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  setKey(key: string): void {
    localStorage.setItem(STORAGE_KEY, key);
    this._hasKey.set(true);
  }

  clearKey(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._hasKey.set(false);
  }
}
