import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudySetService } from 'src/app/services/study-set.service';

interface LearnSet {
  question: string;
  answer: string;
  choices: string[];
}

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="m-auto max-w-4xl">
      <div *ngIf="learnSet">
        <div *ngIf="learnSet[setIndex] as multipleChoice">
          <div
            class="flex min-h-[30rem] flex-col rounded-md bg-white p-4 shadow-lg md:px-8 md:py-6"
          >
            <div class="flex flex-1 flex-col sm:mb-12 sm:flex-row">
              <div class="flex-1 pb-4">
                <div class="mb-6">Term</div>
                <div>{{ multipleChoice.question }}</div>
              </div>
            </div>
            <div>
              <div class="mb-4">Choose answer</div>
              <div class="grid gap-4 sm:grid-cols-2">
                <button
                  *ngFor="let choice of multipleChoice.choices"
                  [disabled]="userAnswer"
                  (click)="chooseAnswer(choice, multipleChoice.answer)"
                  [ngClass]="{
                    'border-green-500 bg-green-50':
                      userAnswer === choice &&
                      userAnswer === multipleChoice.answer,
                    'border-red-500 bg-red-50':
                      userAnswer === choice &&
                      userAnswer !== multipleChoice.answer
                  }"
                  class="cursor-pointer rounded-md border-2 px-4 py-2 peer-checked:border-blue-600 peer-checked:bg-blue-50 "
                >
                  {{ choice }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="!learnSet[setIndex]">
          <div>Learned {{ correct }} / {{ learnSet.length }}</div>
          <div class="flex flex-col gap-6">
            <div
              *ngFor="let flashcard of learnSet"
              class="flex flex-col gap-4 rounded bg-white p-4 drop-shadow sm:flex-row sm:items-center"
            >
              <div class="border-slate-200 sm:basis-2/5 sm:border-r sm:pr-8">
                {{ flashcard.question }}
              </div>
              <div class="sm:basis-3/5 sm:px-8">{{ flashcard.answer }}</div>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="!learnSet">Couldn't create learn set</div>
    </div>
  `,
  styles: [],
})
export class LearnComponent implements OnInit, OnDestroy {
  setId = +this.route.snapshot.params['setId'];
  studySetQuery: any;
  setIndex = 0;
  userAnswer: string | null = null;
  correct: number = 0;
  timeout: any;
  learnSet?: LearnSet[];

  constructor(
    private route: ActivatedRoute,
    private studySetService: StudySetService,
  ) {}

  ngOnInit(): void {
    this.studySetService.getStudySet(this.setId).result$.subscribe((result) => {
      this.studySetQuery = result;

      const data = result.data;

      if (data) {
        this.learnSet = this.generateLearnSet(data);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  chooseAnswer(choice: string, answer: string) {
    this.userAnswer = choice;

    if (choice === answer) {
      this.correct++;
    }

    this.timeout = setTimeout(() => {
      this.userAnswer = null;
      this.setIndex++;
    }, 1000);
  }

  generateLearnSet(data: StudySet): LearnSet[] {
    const flashcards = data.flashcards;

    return flashcards
      .slice(0, flashcards.length > 10 ? 10 : flashcards.length)
      .map((flashcard) => {
        const randomChoices = [...data.flashcards]
          .filter(({ id }) => id !== flashcard.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(({ definition }) => definition);

        const allChoices = [...randomChoices, flashcard.definition].sort(
          () => 0.5 - Math.random(),
        );

        return {
          question: flashcard.term,
          answer: flashcard.definition,
          choices: allChoices,
        };
      });
  }
}
