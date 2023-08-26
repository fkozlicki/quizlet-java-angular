import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/services/user.service';
import { SubscribeDirective } from '@ngneat/subscribe';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    SubscribeDirective,
  ],
  template: `
    <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
      <div class="mb-4">
        <div class="mb-2">Birthday</div>
        <div formGroupName="birthday" class="mb-2 flex">
          <select
            id="month"
            class="rounded-lg border-2 border-slate-600 px-3 py-2 outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-400 focus:border-yellow-400"
            formControlName="month"
          >
            <option *ngFor="let month of months" [value]="month.value">
              {{ month.label }}
            </option>
          </select>
          <select
            class="ml-4 rounded-lg border-2 border-slate-600 px-3 py-2 outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-400 focus:border-yellow-400"
            formControlName="day"
          >
            <option *ngFor="let day of days" [value]="day.value">
              {{ day.label }}
            </option>
          </select>
          <select
            class="ml-4 rounded-lg border-2 border-slate-600 px-3 py-2 outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-400 focus:border-yellow-400"
            formControlName="year"
          >
            <option *ngFor="let year of years" [value]="year.value">
              {{ year.label }}
            </option>
          </select>
        </div>
        <div
          class="text-xs text-red-600"
          *ngIf="
            signupForm.controls.birthday.hasError('invalidDate') &&
            signupForm.controls.birthday.touched
          "
        >
          Invalid date
        </div>
      </div>
      <label class="mb-4 block">
        <div class="mb-2">Email</div>
        <input
          type="email"
          class="mb-2 w-full rounded-lg border-2 border-slate-600 p-3 outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-400 focus:border-yellow-400"
          placeholder="user@quizlet.com"
          formControlName="email"
        />
        <div
          *ngIf="
            signupForm.controls.email.hasError('email') &&
            signupForm.controls.email.touched
          "
          class="text-xs text-red-600"
        >
          Invalid email
        </div>
        <div
          *ngIf="
            signupForm.controls.email.hasError('required') &&
            signupForm.controls.email.touched
          "
          class="text-xs text-red-600"
        >
          Email is required
        </div>
      </label>
      <label class="mb-4 block">
        <div class="mb-2">Name</div>
        <input
          type="text"
          class="mb-2 w-full rounded-lg border-2 border-slate-600 p-3 outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-400 focus:border-yellow-400"
          placeholder="andrew123"
          formControlName="name"
        />
        <div
          class="text-xs text-red-600"
          *ngIf="
            signupForm.controls.name.errors && signupForm.controls.name.touched
          "
        >
          Name is required
        </div>
      </label>
      <label class="mb-4 block">
        <div class="mb-2">Password</div>
        <input
          type="password"
          class="mb-2 w-full rounded-lg border-2 border-slate-600 p-3 outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-400 focus:border-yellow-400"
          placeholder="*********"
          formControlName="password"
        />
        <div
          class="text-xs text-red-600"
          *ngIf="
            signupForm.controls.password.errors &&
            signupForm.controls.password.touched
          "
        >
          Password is required
        </div>
      </label>
      <button
        *subscribe="registerMutation$.result$ as registerMutation"
        [disabled]="!signupForm.valid || registerMutation.isLoading"
        mat-flat-button
        color="primary"
        class="w-full"
      >
        {{ registerMutation.isLoading ? 'Loading' : 'Sign up' }}
      </button>
    </form>
  `,
  styles: [],
})
export class SignupFormComponent {
  months = [
    { value: -1, label: 'Month' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  days = [{ value: -1, label: 'Day' }].concat(
    Array.from({ length: 31 }, (_, i) => ({
      value: i + 1,
      label: (i + 1).toString(),
    })),
  );
  years = [{ value: -1, label: 'Year' }].concat(
    Array.from({ length: 130 }, (_, i) => ({
      value: new Date().getFullYear() - i,
      label: (new Date().getFullYear() - i).toString(),
    })),
  );
  signupForm = new FormGroup(
    {
      birthday: new FormGroup(
        {
          month: new FormControl('-1'),
          day: new FormControl('-1'),
          year: new FormControl('-1'),
        },
        {
          validators: [this.validateDate, Validators.required],
        },
      ),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    },
    {
      updateOn: 'blur',
    },
  );
  @Output() openLoginModal = new EventEmitter();
  registerMutation$ = this.userService.register(() => {
    this.openLoginModal.emit();
  });

  constructor(private userService: UserService) {}

  validateDate(control: AbstractControl) {
    const year = +control.get('year')?.value;
    const month = +control.get('month')?.value;
    const day = +control.get('day')?.value;

    const date = new Date(year, month - 1, day);

    if (
      month === date.getMonth() + 1 &&
      day === date.getDate() &&
      year === date.getFullYear()
    ) {
      return null;
    }

    return { invalidDate: true };
  }

  onSubmit() {
    const { birthday, email, name, password } = this.signupForm.value;

    if (
      !birthday?.day ||
      !birthday.month ||
      !birthday.year ||
      !email ||
      !name ||
      !password
    ) {
      return;
    }

    const { month, day, year } = birthday;
    const birthdayISODate = new Date(`${year}-${month}-${day}`).toISOString();

    this.registerMutation$.mutate({
      birthday: birthdayISODate,
      email,
      name,
      password,
    });
  }
}
