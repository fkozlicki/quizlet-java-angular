import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudySetService } from 'src/app/services/study-set.service';
import { SubscribeDirective } from '@ngneat/subscribe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlashcardsSwiperComponent } from 'src/app/components/flashcards-swiper/flashcards-swiper.component';
import { StudySetModesComponent } from 'src/app/components/study-set-modes/study-set-modes.component';
import { StudySetCtaComponent } from 'src/app/components/study-set-cta/study-set-cta.component';
import { StudySetTermsComponent } from 'src/app/components/study-set-terms/study-set-terms.component';

@Component({
  selector: 'app-studyset',
  standalone: true,
  imports: [
    CommonModule,
    SubscribeDirective,
    MatProgressSpinnerModule,
    FlashcardsSwiperComponent,
    StudySetModesComponent,
    StudySetCtaComponent,
    StudySetTermsComponent,
  ],
  template: `
    <div *subscribe="studySet$ as studySet" class="m-auto max-w-3xl p-4">
      <mat-spinner *ngIf="studySet.isLoading"></mat-spinner>
      <div *ngIf="studySet.data as studySet">
        <div class="mb-3 text-2xl font-bold sm:text-3xl">
          {{ studySet.title }}
        </div>
        <app-study-set-modes [setId]="studySet.id"></app-study-set-modes>
        <app-flashcards-swiper
          [flashcards]="studySet.flashcards"
        ></app-flashcards-swiper>
        <app-study-set-cta
          [setId]="studySet.id"
          [authorName]="studySet.user.name"
        ></app-study-set-cta>
        <app-study-set-terms
          [flashcards]="studySet.flashcards"
          [authorId]="studySet.user.id"
        ></app-study-set-terms>
      </div>
    </div>
  `,
  styles: [],
})
export class StudysetComponent {
  setId = +this.route.snapshot.params['setId'];
  studySet$ = this.studySetService.getStudySet(this.setId).result$;

  constructor(
    private route: ActivatedRoute,
    private studySetService: StudySetService,
  ) {}
}
