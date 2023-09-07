import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { StudyModeButtonComponent } from '../study-mode-button/study-mode-button.component';

@Component({
  selector: 'app-study-set-modes',
  standalone: true,
  imports: [CommonModule, StudyModeButtonComponent, NgOptimizedImage],
  template: `
    <div class="mb-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <app-study-mode-button
        [href]="'/study-set/' + setId + '/flashcards'"
        [name]="'Flashcards'"
      >
        <img
          ngSrc="/assets/images/cards.webp"
          alt="flashcards"
          width="32"
          height="32"
          priority
        />
      </app-study-mode-button>
      <app-study-mode-button
        [href]="'/study-set/' + setId + '/learn'"
        [name]="'Learn'"
      >
        <img
          ngSrc="assets/images/study.webp"
          alt="study"
          width="32"
          height="32"
          priority
        />
      </app-study-mode-button>
      <app-study-mode-button
        [href]="'/study-set/' + setId + '/test'"
        [name]="'Test'"
      >
        <img
          ngSrc="/assets/images/file.webp"
          alt="file"
          width="32"
          height="32"
          priority
        />
      </app-study-mode-button>
      <app-study-mode-button
        [href]="'/study-set/' + setId + '/match'"
        [name]="'Match'"
      >
        <img
          ngSrc="/assets/images/puzzle.webp"
          alt="puzzle"
          width="32"
          height="32"
          priority
        />
      </app-study-mode-button>
    </div>
  `,
  styles: [],
})
export class StudySetModesComponent {
  @Input() setId!: number;
}
