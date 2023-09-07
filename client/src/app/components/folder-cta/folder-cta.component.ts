import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PicturePlaceholderComponent } from '../picture-placeholder/picture-placeholder.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManageFolderModalComponent } from '../manage-folder-modal/manage-folder-modal.component';
import { FolderModalComponent } from '../folder-modal/folder-modal.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-folder-cta',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    PicturePlaceholderComponent,
  ],
  template: `
    <div class="mb-4 flex flex-wrap items-center justify-between">
      <div class="flex items-center gap-10">
        <div class="font-medium text-gray-700">
          {{ folder.studySets.length }} set{{
            folder.studySets.length === 1 ? '' : 's'
          }}
        </div>
        <div class="flex items-center gap-2">
          <div class="font-medium text-gray-500">created by</div>
          <app-picture-placeholder [size]="'small'"></app-picture-placeholder>
          <div class="font-medium">
            {{ folder.user.name }}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button (click)="openDialog()" mat-mini-fab color="primary">
          <mat-icon>add</mat-icon>
        </button>
        <button (click)="openEditFolder()" mat-mini-fab color="primary">
          <mat-icon>edit</mat-icon>
        </button>
        <button (click)="openDeleteFolder()" mat-mini-fab color="primary">
          <mat-icon>delete_outline</mat-icon>
        </button>
      </div>
    </div>
  `,
})
export class FolderCtaComponent implements OnDestroy {
  @Input() folder!: Folder;
  @Input() userId!: number;
  manageFolderRef?: MatDialogRef<ManageFolderModalComponent>;

  constructor(public dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.manageFolderRef?.close();
  }

  openDialog() {
    this.manageFolderRef = this.dialog.open(ManageFolderModalComponent, {
      data: {
        folderId: this.folder.id,
        userId: this.userId,
        folderSets: this.folder.studySets,
      },
    });
  }

  openEditFolder() {
    this.dialog.open(FolderModalComponent, {
      data: {
        type: 'edit',
        folder: this.folder,
      },
    });
  }

  openDeleteFolder() {
    this.dialog.open(DeleteModalComponent, {
      data: {
        id: this.folder.id,
        type: 'folder',
      },
    });
  }
}
