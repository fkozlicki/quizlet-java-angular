import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupFormComponent } from '../signup-form/signup-form.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, SignupFormComponent, MatIconModule],
  template: `
    <div class="fixed left-0 top-0 z-10 flex h-screen w-screen bg-white">
      <div class="hidden flex-1 bg-indigo-400 md:block"></div>
      <div class="relative flex-1 overflow-y-scroll">
        <button class="absolute right-3 top-3" (click)="onCloseSignupModal()">
          <mat-icon>close</mat-icon>
        </button>
        <div class="m-auto max-w-2xl p-4 md:p-8 md:py-16">
          <div class="mb-8 flex gap-8">
            <button class="text-2xl font-bold text-gray-800">Sign up</button>
            <button
              (click)="onOpenLoginModal()"
              class="text-2xl font-bold text-gray-600"
            >
              Log in
            </button>
          </div>
          <app-signup-form
            (openLoginModal)="onOpenLoginModal()"
          ></app-signup-form>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SignupModalComponent {
  @Output() openLoginModal = new EventEmitter();

  constructor(private modalService: ModalService) {}

  onCloseSignupModal() {
    this.modalService.signupModalOpen = false;
  }

  onOpenLoginModal() {
    this.onCloseSignupModal();
    this.openLoginModal.emit();
  }
}
