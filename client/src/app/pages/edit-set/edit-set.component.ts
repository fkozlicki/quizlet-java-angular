import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { StudySetService } from 'src/app/services/study-set.service';
import { SubscribeDirective } from '@ngneat/subscribe';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-set',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    CdkDropList,
    CdkDrag,
    SubscribeDirective,
    RouterModule,
  ],
  template: `
    <div class="m-auto max-w-7xl p-4 sm:p-10">
      <div class="mb-8 flex items-center justify-between">
        <a
          [routerLink]="['/study-set', setId]"
          class="text-base font-medium text-blue-600 hover:text-blue-700"
          >Back to set</a
        >
        <button
          class="hidden sm:block"
          mat-flat-button
          color="primary"
          [disabled]="!studySetForm.valid"
          *subscribe="editStudySetMutation$.result$ as editStudySetMutation"
        >
          {{ editStudySetMutation.isLoading ? 'Loading' : 'Done' }}
        </button>
      </div>
      <form
        *ngIf="studySetForm"
        (ngSubmit)="onSubmit()"
        [formGroup]="studySetForm"
        class="flex flex-col"
      >
        <input
          formControlName="title"
          class="mb-6 w-full rounded-lg bg-white px-4 py-3 text-base font-medium outline-none placeholder:text-base placeholder:font-medium placeholder:text-gray-500"
          type="text"
          placeholder="Enter title"
          name="title"
        />
        <textarea
          formControlName="description"
          class="mb-6 w-full rounded-lg bg-white px-4 py-3 text-base font-medium outline-none placeholder:text-base placeholder:font-medium placeholder:text-gray-500"
          name=""
          id=""
          placeholder="Add a description..."
          cols="30"
          rows="5"
        ></textarea>
        <div
          cdkDropList
          (cdkDropListDropped)="drop($event)"
          formArrayName="flashcards"
          class="mb-4 flex flex-col gap-3"
        >
          <div
            cdkDrag
            [cdkDragDisabled]="isDragDisabled"
            *ngFor="let flashcard of flashcards.controls; let i = index"
            [formGroupName]="i"
            class="cursor-move overflow-hidden rounded-lg"
          >
            <div
              class="group mb-[2px] flex items-center justify-between bg-white p-3"
            >
              <div class="p-2">{{ i + 1 }}</div>
              <div class="flex items-center">
                <div class="text-gray-300 group-hover:text-black">
                  <mat-icon class="hover:text-yellow-400">menu</mat-icon>
                </div>
                <button
                  [disabled]="flashcards.controls.length === 2"
                  (click)="removeFlashcard(i)"
                  class="ml-4 p-2 disabled:text-gray-300"
                  [ngClass]="{
                    'hover:text-yellow-300': flashcards.controls.length !== 2
                  }"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <div
              class="flex flex-col bg-white p-4 pt-0 sm:flex-row sm:gap-10 md:p-6 md:pt-0"
            >
              <input formControlName="place" type="text" class="hidden" />
              <div class="relative z-20 flex-1 pt-5">
                <div
                  (mouseover)="isDragDisabled = true"
                  (mouseout)="isDragDisabled = false"
                  class="mb-4 flex cursor-auto flex-col"
                >
                  <input
                    formControlName="term"
                    type="text"
                    class="border-b-2 border-black outline-none placeholder:text-base placeholder:font-light"
                    placeholder="Enter term"
                  />
                  <label
                    for=""
                    class="mt-[10px] text-xs font-medium uppercase text-gray-400"
                    >Term</label
                  >
                </div>
              </div>
              <div class="relative z-20 flex-1 pt-5">
                <div
                  (mouseover)="isDragDisabled = true"
                  (mouseout)="isDragDisabled = false"
                  class="flex cursor-auto flex-col"
                >
                  <input
                    formControlName="definition"
                    type="text"
                    class="border-b-2 border-black outline-none placeholder:text-base placeholder:font-light"
                    placeholder="Enter definition"
                  />
                  <label
                    for=""
                    class="mt-[10px] text-xs font-medium uppercase text-gray-400"
                    >Definition</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          (click)="addFlashcard()"
          type="button"
          class="group mb-8 flex w-full justify-center rounded-md bg-white p-4 shadow md:py-8"
        >
          <p
            class="border-b-4 border-cyan-400 pb-2 font-semibold uppercase group-hover:border-yellow-500 group-hover:text-yellow-500"
          >
            + add card
          </p>
        </button>
        <button
          class="ml-auto min-h-[3rem]"
          mat-flat-button
          color="primary"
          [ngStyle]="{ width: '7rem', height: '4rem', borderRadius: '10px' }"
          [disabled]="!studySetForm.valid"
          *subscribe="editStudySetMutation$.result$ as editStudySetMutation"
        >
          {{ editStudySetMutation.isLoading ? 'Loading' : 'Done' }}
        </button>
      </form>
    </div>
  `,
  styles: ['.cdk-drag-placeholder { opacity: 0; }'],
})
export class EditSetComponent implements OnInit {
  setId = +this.route.snapshot.paramMap.get('setId')!;
  isDragDisabled = false;
  editStudySetMutation$ = this.studySetService.editStudySet();
  studySetForm: FormGroup = new FormGroup({
    id: new FormControl<number | undefined>(1, {
      validators: [Validators.required],
    }),
    title: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
    }),
    description: new FormControl<string | null | undefined>(undefined),
    flashcards: new FormArray([], {
      validators: [Validators.minLength(2)],
    }),
  });

  constructor(
    private studySetService: StudySetService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.studySetService.getStudySet2(this.setId).subscribe((data) => {
      if (data) {
        const { id, title, description, flashcards } = data;
        this.studySetForm.controls['id'].setValue(id);
        this.studySetForm.controls['title'].setValue(title);
        this.studySetForm.controls['description'].setValue(description);

        flashcards.forEach((flashcard) => {
          this.flashcards.push(
            new FormGroup({
              term: new FormControl(flashcard.term),
              definition: new FormControl(flashcard.definition),
              place: new FormControl(flashcard.place),
            }),
          );
        });
      }
    });
  }

  get flashcards() {
    return this.studySetForm.get('flashcards') as FormArray;
  }

  onSubmit() {
    const { id, title, description, flashcards } = this.studySetForm?.value;

    if (!title || !flashcards || description === undefined) {
      return;
    }

    this.editStudySetMutation$
      .mutate({ id, title, description, flashcards })
      .then((data) => {
        this.router.navigate(['/study-set', data.id]);
      });
  }

  addFlashcard() {
    const flashcardGroup = new FormGroup(
      {
        term: new FormControl(''),
        definition: new FormControl(''),
      },
      {
        validators: this.requireAtLeastOneFieldFilled,
      },
    );
    this.flashcards.push(flashcardGroup);
  }

  removeFlashcard(index: number) {
    this.flashcards.removeAt(index);
  }

  requireAtLeastOneFieldFilled(control: AbstractControl) {
    const term = control.get('term')?.value;
    const definition = control.get('definition')?.value;
    return term || definition ? null : { atLeastOneFieldRequired: true };
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.flashcards.controls,
      event.previousIndex,
      event.currentIndex,
    );

    this.flashcards.controls.forEach((control, index) => {
      control.get('place')?.setValue(index);
    });
  }
}
