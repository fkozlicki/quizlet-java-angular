import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PicturePlaceholderComponent } from '../picture-placeholder/picture-placeholder.component';
import { ModalService } from 'src/app/services/modal.service';
import { SessionService } from 'src/app/services/session.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FolderModalComponent } from '../folder-modal/folder-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    PicturePlaceholderComponent,
    MatDialogModule,
    RouterModule,
  ],
  template: `
    <div class="flex h-16 w-full items-center bg-white px-4">
      <a
        [routerLink]="sessionService.user ? '/latest' : ''"
        class="flex h-full items-center px-2"
      >
        <img
          ngSrc="/assets/images/logo.svg"
          alt="logo"
          width="110"
          height="24"
          priority
        />
      </a>
      <a
        [routerLink]="sessionService.user ? '/latest' : ''"
        class="group relative mx-4 hidden h-full items-center font-semibold text-black/80 md:flex"
      >
        Home
        <div
          class="absolute bottom-0 left-0 h-1 w-full rounded-tl rounded-tr bg-indigo-300 group-hover:block"
          [ngClass]="
            router.url === '/' || router.url === '/latest' ? 'block' : 'hidden'
          "
        ></div>
      </a>
      <div class="m-auto hidden max-w-2xl flex-1 px-6 sm:block">
        <div
          [class.border-slate-600]="isSearchFocused"
          class="flex items-center rounded-full border bg-indigo-50"
        >
          <div class="flex items-center pl-3 pr-2 text-base">
            <mat-icon inline="true" fontIcon="search"></mat-icon>
          </div>
          <input
            (focus)="onSearchFocus()"
            (blur)="onSearchBlur()"
            type="text"
            placeholder="Study sets, textbooks, questions"
            class="min-h-[36px] w-full bg-transparent outline-none placeholder:text-sm placeholder:font-semibold placeholder:text-gray-500"
          />
        </div>
      </div>
      <div class="ml-auto flex">
        <div class="px-2">
          <button
            [matMenuTriggerFor]="createMenu"
            mat-mini-fab
            color="primary"
            class="add-btn"
          >
            <mat-icon>add</mat-icon>
          </button>
          <mat-menu #createMenu="matMenu" xPosition="before">
            <div class="min-w-[150px]">
              <button
                (click)="onCreateStudySet()"
                class="w-full px-6 py-2 text-start hover:bg-slate-100"
              >
                Study set
              </button>
              <div
                (click)="openCreateFolderModal()"
                class="w-full px-6 py-2 text-start hover:bg-slate-100"
              >
                Folder
              </div>
            </div>
          </mat-menu>
        </div>
        <div *ngIf="sessionService.user" class="px-2">
          <button [matMenuTriggerFor]="userMenu">
            <app-picture-placeholder
              [size]="'medium'"
            ></app-picture-placeholder>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="min-w-[150px]">
              <a
                [routerLink]="[sessionService.user.id]"
                class="block w-full px-6 py-2 text-start hover:bg-slate-100"
                >Profile</a
              >
              <a
                [routerLink]="['settings']"
                class="block w-full px-6 py-2 text-start hover:bg-slate-100"
                >Settings</a
              >
              <button
                (click)="onLogout()"
                class="block w-full px-6 py-2 text-start hover:bg-slate-100"
              >
                Log out
              </button>
            </div>
          </mat-menu>
        </div>
        <div *ngIf="!sessionService.user" class="flex gap-2">
          <button
            (click)="openLoginModal()"
            mat-flat-button
            class="whitespace-nowrap"
          >
            Log in
          </button>
          <button
            (click)="openSignupModal()"
            mat-flat-button
            color="primary"
            class="whitespace-nowrap"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ['.add-btn { box-shadow: none !important; }'],
})
export class NavbarComponent {
  isSearchFocused: boolean = false;
  @Output() toggleLoginModal = new EventEmitter<boolean>();

  constructor(
    public sessionService: SessionService,
    private modalService: ModalService,
    public router: Router,
    public dialog: MatDialog,
  ) {}

  onLogout() {
    this.sessionService.clearUser();
    this.router.navigate(['/']);
  }

  onCreateStudySet() {
    if (this.sessionService.user) {
      this.router.navigate(['create-set']);
    } else {
      this.openLoginModal();
    }
  }

  openCreateFolderModal() {
    if (this.sessionService.user) {
      this.dialog.open(FolderModalComponent, {
        data: {
          type: 'create',
        },
      });
    } else {
      this.openLoginModal();
    }
  }

  onSearchFocus() {
    this.isSearchFocused = true;
  }

  onSearchBlur() {
    this.isSearchFocused = false;
  }

  openLoginModal() {
    this.toggleLoginModal.emit(true);
  }

  openSignupModal() {
    this.modalService.signupModalOpen = true;
  }
}
