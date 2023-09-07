import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignupModalComponent } from './components/signup-modal/signup-modal.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { ModalService } from './services/modal.service';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    CommonModule,
    SignupModalComponent,
    LoginModalComponent,
  ],
  template: `
    <app-navbar (toggleLoginModal)="toggleLoginModal($event)"></app-navbar>
    <app-signup-modal
      *ngIf="modalService.signupModalOpen"
      (openLoginModal)="toggleLoginModal(true)"
    ></app-signup-modal>
    <app-login-modal
      *ngIf="loginModalOpen"
      (closeLoginModal)="toggleLoginModal(false)"
    ></app-login-modal>
    <div class="flex min-h-[calc(100vh-4rem)] bg-indigo-50 p-4 md:p-8">
      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit {
  loginModalOpen = false;

  constructor(
    public modalService: ModalService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.sessionService.loadUser();
  }

  toggleLoginModal(value: boolean) {
    this.loginModalOpen = value;
  }
}
