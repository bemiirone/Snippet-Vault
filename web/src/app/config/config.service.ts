import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly _apiUrl = signal('');

  apiUrl() {
    return this._apiUrl();
  }

  async loadConfig(): Promise<void> {
    const res = await fetch('/config.json');
    const config = await res.json();
    this._apiUrl.set(config.apiUrl);
  }
}
