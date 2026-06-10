import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { CreateSnippetDto, UpdateSnippetDto } from '../../models/snippet.model';
import { LANGUAGES } from '../../constants/languages';
import { parseTags, extractErrorMessage } from '../../utils/helpers';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { ErrorBanner } from '../../shared/error-banner/error-banner';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-snippet-page',
  imports: [RouterLink, LoadingState, ErrorBanner],
  templateUrl: './snippet-page.html',
  styleUrl: './snippet-page.scss'
})
export class SnippetPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snippetService = inject(SnippetService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly languages = LANGUAGES;
  protected readonly isNew = signal(true);
  protected readonly title = signal('');
  protected readonly language = signal('ts');
  protected readonly tagsInput = signal('');
  protected readonly content = signal('');
  protected readonly starred = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew.set(false);
      this.loading.set(true);
      try {
        const snippet = await this.snippetService.getById(id);
        this.title.set(snippet.title);
        this.language.set(snippet.programmingLanguage);
        this.tagsInput.set(snippet.tags.join(', '));
        this.content.set(snippet.content);
        this.starred.set(snippet.starred);
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Failed to load snippet');
        this.error.set(message);
      } finally {
        this.loading.set(false);
      }
    }
  }

  protected async save(): Promise<void> {
    if (!this.title() || !this.content()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const dto: CreateSnippetDto & UpdateSnippetDto = {
        title: this.title(),
        content: this.content(),
        programmingLanguage: this.language(),
        tags: parseTags(this.tagsInput()),
        starred: this.starred(),
      };

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        await this.snippetService.update(id, dto);
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Snippet updated successfully' });
      } else {
        await this.snippetService.create(dto as CreateSnippetDto);
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Snippet created successfully' });
      }

      this.router.navigate(['/library']);
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Failed to save snippet');
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  protected async delete(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this snippet?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: async () => {
        this.loading.set(true);
        try {
          await this.snippetService.delete(id);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Snippet deleted successfully' });
          this.router.navigate(['/library']);
        } catch (err: unknown) {
          const message = extractErrorMessage(err, 'Failed to delete snippet');
          this.error.set(message);
        } finally {
          this.loading.set(false);
        }
      }
    });
  }

  protected cancel(): void {
    this.router.navigate(['/library']);
  }

  protected copyRaw(): void {
    navigator.clipboard.writeText(this.content());
  }
}
