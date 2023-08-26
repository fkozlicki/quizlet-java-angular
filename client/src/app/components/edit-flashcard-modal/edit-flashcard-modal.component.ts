import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlashcardService } from 'src/app/services/flashcard.service';
import { SubscribeDirective } from '@ngneat/subscribe';
import { QueryClientService } from '@ngneat/query';

@Component({
  selector: 'app-edit-flashcard-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    SubscribeDirective,
  ],
  template: `
    <div
      class="relative w-[350px] rounded-xl bg-white px-4 py-6 sm:w-[450px] sm:px-8 sm:py-12 md:w-[550px] lg:w-[750px]"
    >
      <button (click)="close()" class="absolute right-4 top-4">
        <mat-icon>close</mat-icon>
      </button>
      <h1 class="mb-6 text-3xl font-semibold">Edit</h1>
      <form [formGroup]="flashcardForm" (ngSubmit)="onSubmit()">
        <div class="mb-6 flex flex-col gap-6">
          <label
            ><input
              formControlName="term"
              type="text"
              name="term"
              class="w-full border-b-2 outline-none"
          /></label>
          <label
            ><input
              formControlName="definition"
              type="text"
              name="definition"
              class="w-full border-b-2 outline-none"
          /></label>
        </div>
        <div class="flex justify-end gap-6">
          <button
            (click)="close()"
            type="button"
            class="rounded-lg px-4 py-2 font-medium text-blue-600 hover:bg-blue-100"
          >
            Cancel</button
          ><button
            *subscribe="editFlashcardMutation$.result$ as editFlashcard"
            [disabled]="editFlashcard.isLoading || flashcardForm.invalid"
            type="submit"
            class="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:bg-gray-500"
          >
            {{ editFlashcard.isLoading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class EditFlashcardModalComponent {
  flashcardForm = new FormGroup({
    id: new FormControl(this.data.id),
    term: new FormControl(this.data.term),
    definition: new FormControl(this.data.definition),
  });
  editFlashcardMutation$ = this.flashcardService.editFlashcard();
  private queryClient = inject(QueryClientService);

  constructor(
    public dialogRef: MatDialogRef<EditFlashcardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Flashcard,
    private flashcardService: FlashcardService,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    const { id, term, definition } = this.flashcardForm.value;

    if (!id || !term || !definition) {
      return;
    }

    this.editFlashcardMutation$
      .mutate({
        id,
        term,
        definition,
      })
      .then(() => {
        this.queryClient.invalidateQueries(['studySet']);
        this.close();
      });
  }
}
