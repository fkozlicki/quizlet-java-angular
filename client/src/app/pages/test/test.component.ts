import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudySetService } from 'src/app/services/study-set.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

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

interface Test {
  multipleChoice: MultipleChoice[];
  written: Written[];
  trueFalse: TrueFalse[];
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="test" class="m-auto max-w-[55rem] p-4 sm:p-10">
      <form
        [formGroup]="testForm"
        (ngSubmit)="onSubmit()"
        class="flex flex-col gap-8"
      >
        <div
          formArrayName="trueFalse"
          *ngFor="let trueFalse of test.trueFalse; let i = index"
          class="flex min-h-[30rem] flex-col rounded-md bg-white p-4 shadow-lg md:px-8 md:py-6"
        >
          <div class="flex flex-1 flex-col sm:mb-12 sm:flex-row">
            <div
              class="flex-1 border-b-2 pb-4 sm:border-b-0 sm:border-r-2 sm:pb-0 sm:pr-4"
            >
              <div class="mb-6">Term</div>
              <div>{{ trueFalse.question }}</div>
            </div>
            <div class="flex-1 pt-4 sm:pl-4 sm:pt-0">
              <div class="mb-6">Definition</div>
              <div>
                {{ trueFalse.distractor }}
              </div>
            </div>
          </div>
          <div>
            <div class="mb-4">Choose answer</div>
            <div class="flex gap-4">
              <label [for]="'trueFalse-' + i + '-true'" class="flex-1"
                ><input
                  [formControlName]="i.toString()"
                  [id]="'trueFalse-' + i + '-true'"
                  [value]="true"
                  type="radio"
                  class="peer hidden"
                />
                <div
                  class='peer-checked:bg-blue-50" cursor-pointer rounded-md border-2 px-4 py-2 text-center peer-checked:border-blue-600'
                >
                  True
                </div></label
              ><label [for]="'trueFalse-' + i + '-false'" class="flex-1"
                ><input
                  [formControlName]="i.toString()"
                  [id]="'trueFalse-' + i + '-false'"
                  [value]="false"
                  type="radio"
                  class="peer hidden"
                />
                <div
                  class="cursor-pointer rounded-md border-2 px-4 py-2 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50"
                >
                  False
                </div></label
              >
            </div>
          </div>
        </div>
        <div
          formArrayName="multipleChoice"
          *ngFor="let multipleChoice of test.multipleChoice; let i = index"
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
              <label
                *ngFor="let choice of multipleChoice.choices; let j = index"
                [for]="'multipleChoice' + i + 'answer' + j"
              >
                <input
                  (click)="multipleChoiceUncheck(i, $event)"
                  [formControlName]="i.toString()"
                  type="radio"
                  [id]="'multipleChoice' + i + 'answer' + j"
                  class="peer hidden"
                  [value]="choice"
                />
                <div
                  class="cursor-pointer rounded-md border-2 px-4 py-2 peer-checked:border-blue-600 peer-checked:bg-blue-50 "
                >
                  {{ choice }}
                </div>
              </label>
            </div>
          </div>
        </div>
        <div
          formArrayName="written"
          *ngFor="let written of test.written; let i = index"
          class="flex min-h-[30rem] flex-col rounded-md bg-white p-4 shadow-lg md:px-8 md:py-6"
        >
          <div class="flex flex-1 flex-col sm:mb-12 sm:flex-row">
            <div class="flex-1 pb-4">
              <div class="mb-6">Term</div>
              <div>{{ written.question }}</div>
            </div>
          </div>
          <div>
            <label for="card-0-answer" class="flex flex-col gap-4">
              <span>Your answer</span>
              <input
                [formControlName]="i.toString()"
                type="text"
                placeholder="Type the answer"
                class="rounded-md bg-slate-200 px-4 py-2 outline-none"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
    <div *ngIf="!test">
      <div class="text-3xl font-bold">
        Quizlet was unable to generate a test.
      </div>
      <div>
        Try adding additional question types or increasing the question limit.
      </div>
    </div>
  `,
  styles: [],
})
export class TestComponent implements OnInit {
  setId = +this.route.snapshot.params['setId'];
  studySetQuery = this.studySetService.getStudySet(this.setId).result$;
  test?: Test;
  testForm = new FormGroup({
    multipleChoice: new FormArray([]),
    written: new FormArray([]),
    trueFalse: new FormArray([]),
  });

  constructor(
    private route: ActivatedRoute,
    private studySetService: StudySetService,
  ) {}

  onSubmit() {
    console.log(this.testForm.value);
  }

  multipleChoiceUncheck(i: number, event: MouseEvent) {
    console.log((this.testForm.get('multipleChoice') as FormArray).at(i).value);
    console.dir(event.target as HTMLInputElement);
    // if (
    //   (this.testForm.get('multipleChoice') as FormArray).at(i).value ===
    //   (event.target as HTMLInputElement).value
    // ) {
    //   (this.testForm.get('multipleChoice') as FormArray).at(i).setValue('');
    // }
  }

  trueFalseUncheck(i: number, event: MouseEvent) {
    if ((event.target as HTMLInputElement).checked) {
      (this.testForm.get('multipleChoice') as FormArray).at(i).setValue('');
    }
  }

  ngOnInit(): void {
    this.studySetService
      .getStudySet(this.setId)
      .result$.subscribe(({ data }) => {
        if (data) {
          if (data.flashcards.length < 4) {
            return;
          }

          const flashcardsCopy = [...data.flashcards].sort(
            () => 0.5 - Math.random(),
          );

          const tenPercent = Math.floor(0.1 * flashcardsCopy.length);
          const count = tenPercent < 1 ? 1 : tenPercent;

          const multipleChoice = flashcardsCopy
            .splice(0, count)
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

          multipleChoice.forEach(() => {
            (this.testForm.get('multipleChoice') as FormArray).push(
              new FormControl(''),
            );
          });
          written.forEach(() => {
            (this.testForm.get('written') as FormArray).push(
              new FormControl(''),
            );
          });
          trueFalse.forEach(() => {
            (this.testForm.get('trueFalse') as FormArray).push(
              new FormControl(''),
            );
          });

          console.log(this.testForm);

          this.test = {
            multipleChoice,
            written,
            trueFalse,
          };
        }
      });
  }
}
