import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../login-form/login-form.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, MatIconModule],
  template: `
    <div class="fixed left-0 top-0 z-10 flex h-screen w-screen bg-white">
      <div class="hidden flex-1 bg-indigo-400 md:block"></div>
      <div class="relative flex-1 overflow-y-scroll">
        <button class="absolute right-3 top-3" (click)="onCloseLoginModal()">
          <mat-icon>close</mat-icon>
        </button>
        <div class="m-auto max-w-2xl p-4 md:p-8 md:py-16">
          <div class="mb-8 flex gap-8">
            <button
              (click)="onOpenSignupModal()"
              class="text-2xl font-bold text-gray-600"
            >
              Sign up
            </button>
            <button class="text-2xl font-bold text-gray-800">Log in</button>
          </div>
          <button
            class="mb-4 w-full rounded-lg border border-gray-300 px-8 py-5 font-semibold text-gray-500 hover:bg-gray-100"
          >
            Continue with Google
          </button>
          <button
            class="w-full rounded-lg border border-gray-300 px-8 py-5 font-semibold text-gray-500 hover:bg-gray-100"
          >
            Continue with Facebook
          </button>
          <div class="my-8 flex items-center">
            <div class="h-0.5 flex-1 bg-slate-200"></div>
            <div class="mx-4">or email</div>
            <div class="h-0.5 flex-1 bg-slate-200"></div>
          </div>
          <app-login-form
            (closeLoginModal)="onCloseLoginModal()"
          ></app-login-form>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginModalComponent {
  @Output() closeLoginModal = new EventEmitter<boolean>();

  constructor(private modalService: ModalService) {}

  onCloseLoginModal() {
    this.closeLoginModal.emit();
  }

  onOpenSignupModal() {
    this.onCloseLoginModal();
    this.modalService.signupModalOpen = true;
  }
}