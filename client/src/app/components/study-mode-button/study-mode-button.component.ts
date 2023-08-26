import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-study-mode-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a
      class="block rounded-md border-b-4 border-white bg-white px-3 py-2 shadow-sm hover:border-cyan-200"
      [href]="href"
    >
      <div class="flex items-center gap-3">
        <ng-content></ng-content>
        <span class="text-base font-medium">{{ name }}</span>
      </div>
    </a>
  `,
  styles: [],
})
export class StudyModeButtonComponent {
  @Input() href!: string;
  @Input() name!: string;
}
