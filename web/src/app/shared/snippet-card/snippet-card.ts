import { Component, input, computed, signal, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Snippet, UpdateSnippetDto } from '../../models/snippet.model';
import { SnippetService } from '../../services/snippet.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { parseTags, extractErrorMessage } from '../../utils/helpers';
import { LANGUAGES } from '../../constants/languages';
import hljs from 'highlight.js/lib/common';

hljs.registerAliases('ts', { languageName: 'typescript' });
hljs.registerAliases('js', { languageName: 'javascript' });
hljs.registerAliases('yml', { languageName: 'yaml' });
hljs.registerAliases('html', { languageName: 'xml' });
hljs.registerAliases('sh', { languageName: 'bash' });

@Component({
  selector: 'app-snippet-card',
  templateUrl: './snippet-card.html',
  styleUrl: './snippet-card.scss',
  imports: [RouterLink]
})
export class SnippetCard {
  private readonly snippetService = inject(SnippetService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly snippet = input.required<Snippet>();
  readonly showStarred = input(false);

  protected readonly languages = LANGUAGES;

  protected readonly expanded = signal(false);
  protected readonly editing = signal(false);
  protected readonly editTitle = signal('');
  protected readonly editContent = signal('');
  protected readonly editTags = signal('');
  protected readonly editLanguage = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  readonly saved = output<void>();
  readonly deleted = output<void>();

  protected readonly highlightedCode = computed(() => {
    const lang = this.snippet().programmingLanguage;
    const result = hljs.highlight(this.snippet().content, { language: lang, ignoreIllegals: true });
    return result.value;
  });

  protected toggleExpand(): void {
    this.expanded.update(v => !v);
  }

  protected startEdit(): void {
    const s = this.snippet();
    this.editTitle.set(s.title);
    this.editContent.set(s.content);
    this.editTags.set(s.tags.join(', '));
    this.editLanguage.set(s.programmingLanguage);
    this.editing.set(true);
    this.expanded.set(true);
    this.error.set('');
  }

  protected cancelEdit(): void {
    this.editing.set(false);
    this.error.set('');
  }

  protected async saveEdit(): Promise<void> {
    if (!this.editTitle() || !this.editContent()) return;

    this.saving.set(true);
    this.error.set('');

    try {
      const tags = parseTags(this.editTags());

      const dto: UpdateSnippetDto = {
        title: this.editTitle(),
        content: this.editContent(),
        programmingLanguage: this.editLanguage(),
        tags,
      };

      await this.snippetService.update(this.snippet()._id, dto);
      this.saved.emit();
      this.editing.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Saved',
        detail: 'Snippet updated successfully'
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Failed to save');
      this.error.set(message);
    } finally {
      this.saving.set(false);
    }
  }

  copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content);
    this.messageService.add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Snippet copied to clipboard'
    });
  }

  deleteSnippet(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this snippet?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: async () => {
        try {
          await this.snippetService.delete(this.snippet()._id);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Snippet deleted successfully' });
          this.deleted.emit();
        } catch (err: unknown) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: extractErrorMessage(err, 'Failed to delete snippet') });
        }
      }
    });
  }
}
