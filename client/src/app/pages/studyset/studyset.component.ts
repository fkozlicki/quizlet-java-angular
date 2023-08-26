import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudySetService } from 'src/app/services/study-set.service';
import { SubscribeDirective } from '@ngneat/subscribe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudyModeButtonComponent } from 'src/app/components/study-mode-button/study-mode-button.component';
import { PicturePlaceholderComponent } from 'src/app/components/picture-placeholder/picture-placeholder.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SessionService } from 'src/app/services/session.service';
import { MatDialog } from '@angular/material/dialog';
import { EditFlashcardModalComponent } from 'src/app/components/edit-flashcard-modal/edit-flashcard-modal.component';
import { ManageStudySetModalComponent } from 'src/app/components/manage-study-set-modal/manage-study-set-modal.component';
import { FlashcardsSwiperComponent } from 'src/app/components/flashcards-swiper/flashcards-swiper.component';
import { DeleteModalComponent } from 'src/app/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-studyset',
  standalone: true,
  imports: [
    CommonModule,
    SubscribeDirective,
    MatProgressSpinnerModule,
    StudyModeButtonComponent,
    NgOptimizedImage,
    PicturePlaceholderComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FlashcardsSwiperComponent,
  ],
  template: `
    <div *subscribe="studySet$ as studySet" class="m-auto max-w-3xl p-4">
      <mat-spinner *ngIf="studySet.isLoading"></mat-spinner>
      <div *ngIf="studySet.data as studySet">
        <div class="mb-3 text-2xl font-bold sm:text-3xl">
          {{ studySet.title }}
        </div>
        <div class="mb-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <app-study-mode-button
            [href]="'/study-set/' + studySet.id + '/flashcards'"
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
            [href]="'/study-set/' + studySet.id + '/learn'"
            [name]="'Learn'"
          >
            <img
              ngSrc="/assets/images/study.webp"
              alt="flashcards"
              width="32"
              height="32"
              priority
            />
          </app-study-mode-button>
          <app-study-mode-button
            [href]="'/study-set/' + studySet.id + '/test'"
            [name]="'Test'"
          >
            <img
              ngSrc="/assets/images/file.webp"
              alt="flashcards"
              width="32"
              height="32"
              priority
            />
          </app-study-mode-button>
          <app-study-mode-button
            [href]="'/study-set/' + studySet.id + '/match'"
            [name]="'Match'"
          >
            <img
              ngSrc="/assets/images/puzzle.webp"
              alt="flashcards"
              width="32"
              height="32"
              priority
            />
          </app-study-mode-button>
        </div>
        <app-flashcards-swiper
          [flashcards]="studySet.flashcards"
        ></app-flashcards-swiper>
        <div class="my-8 flex justify-between">
          <div class="flex items-center gap-4">
            <app-picture-placeholder
              [size]="'medium'"
            ></app-picture-placeholder>
            <div>
              <div class="text-xs text-gray-400">Created by</div>
              <div class="text-sm font-medium">{{ studySet.user.name }}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <a
              [routerLink]="['/study-set', setId, 'edit']"
              mat-mini-fab
              color="primary"
              aria-label="Edit set"
            >
              <mat-icon>edit</mat-icon>
            </a>
            <button
              (click)="openManageStudySetModal()"
              mat-mini-fab
              color="primary"
            >
              <mat-icon>folder_open</mat-icon>
            </button>
            <button (click)="openDeleteStudySet()" mat-mini-fab color="primary">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        </div>
        <div>
          <div class="mb-5 text-lg font-bold">
            Terms in this set ({{ studySet.flashcards.length }})
          </div>
          <div class="flex flex-col gap-4">
            <div
              *ngFor="let flashcard of studySet.flashcards"
              class="flex flex-col gap-4 rounded bg-white p-4 drop-shadow sm:flex-row sm:items-center"
            >
              <div class="order-2 flex justify-end gap-4">
                <button
                  *ngIf="sessionService.user?.id === studySet.user.id"
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
      </div>
    </div>
  `,
  styles: [],
})
export class StudysetComponent {
  userId = this.sessionService.user?.id;
  setId = +this.route.snapshot.params['setId'];
  studySet$ = this.studySetService.getStudySet(this.setId).result$;

  constructor(
    private route: ActivatedRoute,
    private studySetService: StudySetService,
    public sessionService: SessionService,
    public dialog: MatDialog,
  ) {}

  openEditFlashcard(flashcard: Flashcard) {
    this.dialog.open(EditFlashcardModalComponent, {
      data: flashcard,
    });
  }

  openDeleteStudySet() {
    this.dialog.open(DeleteModalComponent, {
      data: {
        id: this.setId,
        type: 'study-set',
      },
    });
  }

  openManageStudySetModal() {
    this.dialog.open(ManageStudySetModalComponent, {
      data: this.setId,
    });
  }
}
