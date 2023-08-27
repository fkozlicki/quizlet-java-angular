import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answers } from 'src/app/pages/test/test.component';

@Component({
  selector: 'app-test-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-8">
      <div>
        <div>Your result:</div>
        <div>{{ correct }} / {{ count }}</div>
      </div>
      <div
        *ngFor="let trueFalse of userAnswers.trueFalse"
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
          <div class="flex gap-4">
            <div
              class="flex-1 cursor-pointer rounded-md border-2 px-4 py-2 text-center"
              [ngClass]="{
                'border-green-500 bg-green-50':
                  trueFalse.answer === trueFalse.distractor,
                'border-red-500 bg-red-50':
                  trueFalse.answer !== trueFalse.distractor &&
                  trueFalse.userAnswer === true
              }"
            >
              True
            </div>
            <div
              class="flex-1 cursor-pointer rounded-md border-2 px-4 py-2 text-center"
              [ngClass]="{
                'border-green-500 bg-green-50':
                  trueFalse.answer !== trueFalse.distractor,
                'border-red-500 bg-red-50':
                  trueFalse.answer === trueFalse.distractor &&
                  trueFalse.userAnswer === false
              }"
            >
              False
            </div>
          </div>
        </div>
      </div>
      <div
        *ngFor="let multipleChoice of userAnswers.multipleChoice"
        class="flex min-h-[30rem] flex-col rounded-md bg-white p-4 shadow-lg md:px-8 md:py-6"
      >
        <div class="flex flex-1 flex-col sm:mb-12 sm:flex-row">
          <div class="flex-1 pb-4">
            <div class="mb-6">Term</div>
            <div>{{ multipleChoice.question }}</div>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div
            *ngFor="let choice of multipleChoice.choices"
            class="cursor-pointer rounded-md border-2 px-4 py-2"
            [ngClass]="{
              'border-green-500 bg-green-50': choice === multipleChoice.answer,
              'border-red-500 bg-red-50':
                choice === multipleChoice.userAnswer &&
                choice !== multipleChoice.answer
            }"
          >
            {{ choice }}
          </div>
        </div>
      </div>
      <div
        *ngFor="let written of userAnswers.written"
        class="flex min-h-[30rem] flex-col rounded-md bg-white p-4 shadow-lg md:px-8 md:py-6"
      >
        <div class="flex flex-1 flex-col sm:mb-12 sm:flex-row">
          <div class="flex-1 pb-4">
            <div class="mb-6">Term</div>
            <div>{{ written.question }}</div>
          </div>
        </div>
        <div
          *ngIf="written.userAnswer !== written.answer"
          class="mb-4 rounded-md border-2 border-green-500 bg-green-50 px-4 py-2"
        >
          {{ written.answer }}
        </div>
        <div
          [ngClass]="
            written.userAnswer === written.answer
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
          "
          class="rounded-md border-2 px-4 py-2"
        >
          {{ written.userAnswer }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TestResultComponent implements OnInit {
  @Input() userAnswers!: Answers;
  correct!: number;
  count!: number;

  ngOnInit(): void {
    const { multipleChoice, trueFalse, written } = this.userAnswers;
    this.count = [...multipleChoice, ...trueFalse, ...written].length;
    this.correct =
      multipleChoice.reduce(
        (prev, curr) => prev + (curr.userAnswer === curr.answer ? 1 : 0),
        0,
      ) +
      trueFalse.reduce(
        (prev, curr) =>
          prev +
          ((curr.distractor === curr.answer && curr.userAnswer === true) ||
          (curr.distractor !== curr.answer && curr.userAnswer === false)
            ? 1
            : 0),
        0,
      ) +
      written.reduce(
        (prev, curr) => prev + (curr.userAnswer === curr.answer ? 1 : 0),
        0,
      );
  }
}
