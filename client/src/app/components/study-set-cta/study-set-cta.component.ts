import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PicturePlaceholderComponent } from '../picture-placeholder/picture-placeholder.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ManageStudySetModalComponent } from '../manage-study-set-modal/manage-study-set-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { SessionService } from 'src/app/services/session.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-study-set-cta',
  standalone: true,
  imports: [
    CommonModule,
    PicturePlaceholderComponent,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    NgOptimizedImage,
  ],
  template: `
    <div class="my-8 flex justify-between">
      <div class="flex items-center gap-4">
        <a [routerLink]="['/', user.id]">
          <img
            *ngIf="user.imageUrl"
            [ngSrc]="user.imageUrl"
            alt=""
            width="40"
            height="40"
            class="rounded-full"
          />
        </a>
        <app-picture-placeholder
          *ngIf="!user.imageUrl"
          [size]="'medium'"
        ></app-picture-placeholder>
        <div>
          <div class="text-xs text-gray-400">Created by</div>
          <a [routerLink]="['/', user.id]" class="text-sm font-medium">{{
            user.name
          }}</a>
        </div>
      </div>
      <div class="flex gap-2">
        <a
          *ngIf="sessionService.user?.id === user.id"
          [routerLink]="['/study-set', setId, 'edit']"
          mat-mini-fab
          color="primary"
          aria-label="Edit set"
        >
          <mat-icon>edit</mat-icon>
        </a>
        <button
          (click)="openManageStudySetModal()"
          mat-mini-fab
          color="primary"
        >
          <mat-icon>folder_open</mat-icon>
        </button>
        <button
          *ngIf="sessionService.user?.id === user.id"
          (click)="openDeleteStudySet()"
          mat-mini-fab
          color="primary"
        >
          <mat-icon>delete_outline</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class StudySetCtaComponent {
  @Input() setId!: number;
  @Input() user!: User;

  constructor(
    public dialog: MatDialog,
    public sessionService: SessionService,
    private modalService: ModalService,
  ) {}

  openDeleteStudySet() {
    this.dialog.open(DeleteModalComponent, {
      data: {
        id: this.setId,
        type: 'study-set',
      },
    });
  }

  openManageStudySetModal() {
    if (this.sessionService.user) {
      this.dialog.open(ManageStudySetModalComponent, {
        data: this.setId,
      });
    } else {
      this.modalService.signupModalOpen = true;
    }
  }
}
