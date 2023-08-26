import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardComponent } from '../flashcard/flashcard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-flashcards-swiper',
  standalone: true,
  imports: [
    CommonModule,
    FlashcardComponent,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
  ],
  template: `
    <app-flashcard
      *ngIf="currentFlashcard && !finished"
      [term]="currentFlashcard.term"
      [definition]="currentFlashcard.definition"
    ></app-flashcard>
    <div *ngIf="!finished" class="mb-4 flex items-center justify-center gap-4">
      <button
        (click)="onBack()"
        [disabled]="currentIndex === 0"
        mat-mini-fab
        color="primary"
        [ngStyle]="{ 'box-shadow': 'none' }"
      >
        <mat-icon>arrow_back</mat-icon>
      </button>
      <div>{{ currentIndex + 1 }} / {{ flashcards.length }}</div>
      <button
        (click)="onForward()"
        [disabled]="currentIndex === flashcards.length"
        mat-mini-fab
        color="primary"
        [ngStyle]="{ 'box-shadow': 'none' }"
      >
        <mat-icon>arrow_forward</mat-icon>
      </button>
    </div>
    <div *ngIf="finished">
      <div class="mb-8 text-3xl font-bold">
        Way to go! You've reviewed all the cards.
      </div>
      <div
        (click)="backToLast()"
        class="mb-3 flex cursor-pointer items-center gap-3 text-blue-700"
      >
        <mat-icon
          [ngStyle]="{
            width: '16px',
            height: '16px',
            'font-size': '16px'
          }"
          >arrow_back</mat-icon
        >
        <div class="font-medium">Back to last question</div>
      </div>
    </div>
    <mat-progress-bar
      [ngStyle]="{
        height: '2px',
        overflow: 'hidden'
      }"
      mode="determinate"
      [value]="(currentIndex / flashcards.length) * 100"
    ></mat-progress-bar>
  `,
  styles: [],
})
export class FlashcardsSwiperComponent implements OnInit {
  @Input() flashcards!: Flashcard[];
  currentIndex: number = 0;
  currentFlashcard?: Flashcard;
  finished = false;

  ngOnInit(): void {
    this.currentFlashcard = this.flashcards[this.currentIndex];
  }

  backToLast() {
    this.currentIndex--;
    this.finished = false;
  }

  onForward() {
    if (this.currentIndex < this.flashcards.length - 1) {
      this.currentIndex++;
      this.currentFlashcard = this.flashcards[this.currentIndex];
    }
    if (this.currentIndex === this.flashcards.length - 1) {
      this.currentIndex++;
      this.finished = true;
    }
  }

  onBack() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentFlashcard = this.flashcards[this.currentIndex];
    }
  }
}
