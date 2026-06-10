import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Snippet } from '../../models/snippet.model';
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
  readonly snippet = input.required<Snippet>();
  readonly showStarred = input(false);

  protected readonly highlightedCode = computed(() => {
    const lang = this.snippet().programmingLanguage;
    const result = hljs.highlight(this.snippet().content, { language: lang, ignoreIllegals: true });
    return result.value;
  });

  copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content);
  }
}
