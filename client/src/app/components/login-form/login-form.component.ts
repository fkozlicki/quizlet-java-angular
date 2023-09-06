import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="mb-8 flex flex-col">
        <div
          class="mb-2 text-xs text-red-500"
          *ngIf="
            loginForm.controls.email.hasError('required') &&
            loginForm.controls.email.touched
          "
        >
          Email is required
        </div>
        <div
          class="mb-2 text-xs text-red-500"
          *ngIf="
            loginForm.controls.email.hasError('email') &&
            loginForm.controls.email.touched
          "
        >
          Invalid email
        </div>
        <input
          formControlName="email"
          type="email"
          id="email"
          placeholder="Type your email address or username"
          class="peer pb-1 text-lg outline-none placeholder:text-lg placeholder:text-gray-300"
        />
        <span
          class="before before:transition-height before:ease-borderHeight relative h-1 w-full before:absolute before:left-0 before:top-0 before:block before:h-[2px] before:w-full before:bg-black before:duration-[120ms] before:content-[''] peer-focus:before:h-1 peer-focus:before:bg-yellow-500"
        ></span>
        <label
          htmlFor="email"
          class="mt-[10px] text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Email
        </label>
      </div>
      <div class="mb-8 flex flex-col">
        <div
          class="mb-2 text-xs text-red-500"
          *ngIf="
            loginForm.controls.email.hasError('required') &&
            loginForm.controls.email.touched
          "
        >
          Password is required
        </div>
        <input
          formControlName="password"
          type="password"
          id="password"
          placeholder="Type your password"
          class="peer pb-1 text-lg outline-none placeholder:text-lg placeholder:text-gray-300"
        />
        <span
          class="before before:transition-height before:ease-borderHeight relative h-1 w-full before:absolute before:left-0 before:top-0 before:block before:h-[2px] before:w-full before:bg-black before:duration-[120ms] before:content-[''] peer-focus:before:h-1 peer-focus:before:bg-yellow-500"
        ></span>
        <label
          htmlFor="password"
          class="mt-[10px] text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Password
        </label>
      </div>
      <button
        [disabled]="!loginForm.valid"
        mat-flat-button
        color="primary"
        class="min-h-[5rem] w-full"
      >
        Log in
      </button>
    </form>
  `,
  styles: [],
})
export class LoginFormComponent {
  loginForm = new FormGroup(
    {
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    },
    {
      updateOn: 'change',
    },
  );
  @Output() closeLoginModal = new EventEmitter();

  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
  ) {}

  onSubmit() {
    const { email, password } = this.loginForm.value;

    if (!email || !password) {
      return;
    }

    this.authService
      .login()
      .mutate({ email, password })
      .then(({ token, user }) => {
        this.closeLoginModal.emit();
        this.sessionService.saveUser({ ...user, token });
        this.router.navigate(['/latest']);
      });
  }
}
