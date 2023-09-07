import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PicturePlaceholderComponent } from '../picture-placeholder/picture-placeholder.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ManageStudySetModalComponent } from '../manage-study-set-modal/manage-study-set-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-study-set-cta',
  standalone: true,
  imports: [
    CommonModule,
    PicturePlaceholderComponent,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="my-8 flex justify-between">
      <div class="flex items-center gap-4">
        <app-picture-placeholder [size]="'medium'"></app-picture-placeholder>
        <div>
          <div class="text-xs text-gray-400">Created by</div>
          <div class="text-sm font-medium">{{ authorName }}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <a
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
        <button (click)="openDeleteStudySet()" mat-mini-fab color="primary">
          <mat-icon>delete_outline</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class StudySetCtaComponent {
  @Input() setId!: number;
  @Input() authorName!: string;

  constructor(public dialog: MatDialog) {}

  openDeleteStudySet() {
    this.dialog.open(DeleteModalComponent, {
      data: {
        id: this.setId,
        type: 'study-set',
      },
    });
  }

  openManageStudySetModal() {
    this.dialog.open(ManageStudySetModalComponent, {
      data: this.setId,
    });
  }
}
