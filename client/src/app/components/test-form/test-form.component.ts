import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Test } from 'src/app/pages/test/test.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: `
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
        <div [formGroupName]="i">
          <div class="mb-4">Choose answer</div>
          <div class="flex gap-4">
            <label [for]="'trueFalse-' + i + '-true'" class="flex-1"
              ><input
                formControlName="userAnswer"
                [id]="'trueFalse-' + i + '-true'"
                [value]="true"
                type="radio"
                class="peer hidden"
              />
              <div
                class='peer-checked:bg-blue-50" cursor-pointer rounded-md border-2 px-4 py-2 text-center peer-checked:border-blue-600'
              >
                True
              </div>
            </label>
            <label [for]="'trueFalse-' + i + '-false'" class="flex-1">
              <input
                formControlName="userAnswer"
                [id]="'trueFalse-' + i + '-false'"
                [value]="false"
                type="radio"
                class="peer hidden"
              />
              <div
                class="cursor-pointer rounded-md border-2 px-4 py-2 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50"
              >
                False
              </div>
            </label>
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
        <div [formGroupName]="i">
          <div class="mb-4">Choose answer</div>
          <div class="grid gap-4 sm:grid-cols-2">
            <label
              *ngFor="let choice of multipleChoice.choices; let j = index"
              [for]="'multipleChoice' + i + 'answer' + j"
            >
              <input
                formControlName="userAnswer"
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
        <div [formGroupName]="i">
          <label for="card-0-answer" class="flex flex-col gap-4">
            <span>Your answer</span>
            <input
              formControlName="userAnswer"
              type="text"
              placeholder="Type the answer"
              class="rounded-md bg-slate-200 px-4 py-2 outline-none"
            />
          </label>
        </div>
      </div>
      <button mat-flat-button color="primary">Submit</button>
    </form>
  `,
  styles: [],
})
export class TestFormComponent implements OnInit {
  @Input() test!: Test;
  @Output() handleSubmit = new EventEmitter();
  testForm = new FormGroup({
    multipleChoice: new FormArray([]),
    written: new FormArray([]),
    trueFalse: new FormArray([]),
  });

  ngOnInit(): void {
    this.test.multipleChoice.forEach(({ question, answer, choices }) => {
      (this.testForm.get('multipleChoice') as FormArray).push(
        new FormGroup({
          question: new FormControl(question),
          answer: new FormControl(answer),
          choices: new FormArray(
            choices.map((choice) => new FormControl(choice)),
          ),
          userAnswer: new FormControl('', [Validators.required]),
        }),
      );
    });

    this.test.trueFalse.forEach(({ question, answer, distractor }) => {
      (this.testForm.get('trueFalse') as FormArray).push(
        new FormGroup({
          question: new FormControl(question),
          answer: new FormControl(answer),
          distractor: new FormControl(distractor),
          userAnswer: new FormControl('', [Validators.required]),
        }),
      );
    });

    this.test.written.forEach(({ question, answer }) => {
      (this.testForm.get('written') as FormArray).push(
        new FormGroup({
          question: new FormControl(question),
          answer: new FormControl(answer),
          userAnswer: new FormControl('', [Validators.required]),
        }),
      );
    });
  }

  onSubmit() {
    this.handleSubmit.emit(this.testForm.value);
  }
}
