import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Snippet, SnippetStats, CreateSnippetDto, UpdateSnippetDto, QuerySnippetDto } from '../models/snippet.model';

@Injectable({ providedIn: 'root' })
export class SnippetService {
  private readonly http = inject(HttpClient);

  async getAll(query: QuerySnippetDto = {}): Promise<Snippet[]> {
    const params: Record<string, string> = {};
    if (query.q) params['q'] = query.q;
    if (query.tags) params['tags'] = query.tags;
    if (query.programmingLanguage) params['programmingLanguage'] = query.programmingLanguage;
    if (query.sort) params['sort'] = query.sort;
    if (query.limit) params['limit'] = String(query.limit);

    return firstValueFrom(
      this.http.get<Snippet[]>('/api/snippets', { params })
    );
  }

  async getById(id: string): Promise<Snippet> {
    return firstValueFrom(
      this.http.get<Snippet>(`/api/snippets/${id}`)
    );
  }

  async create(dto: CreateSnippetDto): Promise<Snippet> {
    return firstValueFrom(
      this.http.post<Snippet>('/api/snippets', dto)
    );
  }

  async update(id: string, dto: UpdateSnippetDto): Promise<Snippet> {
    return firstValueFrom(
      this.http.patch<Snippet>(`/api/snippets/${id}`, dto)
    );
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`/api/snippets/${id}`)
    );
  }

  async getStats(): Promise<SnippetStats> {
    return firstValueFrom(
      this.http.get<SnippetStats>('/api/snippets/stats')
    );
  }

  async exportAll(): Promise<Snippet[]> {
    return firstValueFrom(
      this.http.get<Snippet[]>('/api/export/json')
    );
  }
}
