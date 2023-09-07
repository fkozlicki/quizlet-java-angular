import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudySetService } from 'src/app/services/study-set.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TestFormComponent } from 'src/app/components/test-form/test-form.component';
import { TestResultComponent } from 'src/app/components/test-result/test-result.component';

interface MultipleChoice {
  question: string;
  answer: string;
  choices: string[];
}

interface Written {
  question: string;
  answer: string;
}

interface TrueFalse {
  question: string;
  answer: string;
  distractor: string;
}

export interface Test {
  multipleChoice: MultipleChoice[];
  written: Written[];
  trueFalse: TrueFalse[];
}

export interface Answers {
  multipleChoice: (MultipleChoice & { userAnswer: string })[];
  written: (Written & { userAnswer: string })[];
  trueFalse: (TrueFalse & { userAnswer: boolean })[];
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    TestFormComponent,
    TestResultComponent,
  ],
  template: `
    <div
      class="m-auto grid h-full max-w-[55rem] place-items-center p-4 sm:p-10"
    >
      <app-test-form
        *ngIf="test && !userAnswers"
        [test]="test"
        (handleSubmit)="onSubmit($event)"
      ></app-test-form>
      <app-test-result
        *ngIf="userAnswers"
        [userAnswers]="userAnswers"
      ></app-test-result>
      <div *ngIf="!test">
        <div class="text-3xl font-bold">
          Quizlet was unable to generate a test.
        </div>
        <div>
          Try adding additional question types or increasing the question limit.
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TestComponent implements OnInit {
  setId = +this.route.snapshot.params['setId'];
  studySetQuery: any;
  test?: Test;
  userAnswers?: Answers;

  constructor(
    private route: ActivatedRoute,
    private studySetService: StudySetService,
  ) {}

  ngOnInit(): void {
    this.studySetService.getStudySet(this.setId).result$.subscribe((result) => {
      this.studySetQuery = result;

      const data = result.data;

      if (data) {
        this.test = this.generateTest(data);
      }
    });
  }

  onSubmit(userAnswers: Answers) {
    this.userAnswers = userAnswers;
    window.scrollTo({ top: 0 });
  }

  generateTest(data: StudySet): Test | undefined {
    if (data.flashcards.length < 4) {
      return;
    }

    const flashcardsCopy = [...data.flashcards].sort(() => 0.5 - Math.random());

    const tenPercent = Math.floor(0.1 * flashcardsCopy.length);
    const count = tenPercent < 1 ? 1 : tenPercent;

    const multipleChoice = flashcardsCopy.splice(0, count).map((flashcard) => {
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

    const written = flashcardsCopy.splice(0, count).map((flashcard) => {
      return {
        question: flashcard.term,
        answer: flashcard.definition,
      };
    });

    const trueFalse = flashcardsCopy.map((flashcard) => {
      const randomFalseAnswer = [...data.flashcards]
        .filter(({ id }) => id !== flashcard.id)
        .sort(() => 0.5 - Math.random())[0].definition;

      const distractor = [randomFalseAnswer, flashcard.definition].sort(
        () => 0.5 - Math.random(),
      )[0];

      return {
        question: flashcard.term,
        answer: flashcard.definition,
        distractor,
      };
    });

    return {
      multipleChoice,
      trueFalse,
      written,
    };
  }
}
