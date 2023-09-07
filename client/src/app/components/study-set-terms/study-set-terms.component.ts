import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from 'src/app/services/session.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditFlashcardModalComponent } from '../edit-flashcard-modal/edit-flashcard-modal.component';

@Component({
  selector: 'app-study-set-terms',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div>
      <div class="mb-5 text-lg font-bold">
        Terms in this set ({{ flashcards.length }})
      </div>
      <div class="flex flex-col gap-4">
        <div
          *ngFor="let flashcard of flashcards"
          class="flex flex-col gap-4 rounded bg-white p-4 drop-shadow sm:flex-row sm:items-center"
        >
          <div class="order-2 flex justify-end gap-4">
            <button
              *ngIf="sessionService.user?.id === authorId"
              class="h-10 w-10 rounded-full p-2 hover:bg-gray-200"
              (click)="openEditFlashcard(flashcard)"
            >
              <mat-icon>edit</mat-icon>
            </button>
          </div>
          <div class="border-slate-200 sm:basis-2/5 sm:border-r sm:pr-8">
            {{ flashcard.term }}
          </div>
          <div class="sm:basis-3/5 sm:px-8">{{ flashcard.definition }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class StudySetTermsComponent {
  @Input() flashcards!: Flashcard[];
  @Input() authorId!: number;

  constructor(
    public sessionService: SessionService,
    public dialog: MatDialog,
  ) {}

  openEditFlashcard(flashcard: Flashcard) {
    this.dialog.open(EditFlashcardModalComponent, {
      data: flashcard,
    });
  }
}
