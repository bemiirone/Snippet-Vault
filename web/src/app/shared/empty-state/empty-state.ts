import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  imports: [RouterLink]
})
export class EmptyState {
  readonly message = input.required<string>();
  readonly actionLabel = input<string>();
  readonly actionLink = input<string>();
}
