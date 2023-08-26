import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardsSwiperComponent } from 'src/app/components/flashcards-swiper/flashcards-swiper.component';
import { ActivatedRoute } from '@angular/router';
import { StudySetService } from 'src/app/services/study-set.service';
import { SubscribeDirective } from '@ngneat/subscribe';

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [CommonModule, FlashcardsSwiperComponent, SubscribeDirective],
  template: `
    <div
      class="m-auto max-w-[1400px] px-4"
      *subscribe="studySetQuery.result$ as studySet"
    >
      <div *ngIf="studySet.data as studySet" class="max-w-5xl">
        <app-flashcards-swiper
          [flashcards]="studySet.flashcards"
        ></app-flashcards-swiper>
      </div>
    </div>
  `,
  styles: [],
})
export class FlashcardsComponent {
  setId = +this.route.snapshot.params['setId'];
  studySetQuery = this.studySetService.getStudySet(this.setId);

  constructor(
    private route: ActivatedRoute,
    private studySetService: StudySetService,
  ) {}
}
