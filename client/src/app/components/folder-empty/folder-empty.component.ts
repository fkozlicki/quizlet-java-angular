import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManageFolderModalComponent } from '../manage-folder-modal/manage-folder-modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-folder-empty',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="grid h-full place-items-center">
      <div class="text-center">
        <div class="mb-2 text-3xl font-bold">This folder has no sets yet</div>
        <div class="mb-4 text-xl font-semibold">
          Organize all your study sets with folders.
        </div>
        <button (click)="openDialog()" mat-flat-button color="primary">
          Add a set
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class FolderEmptyComponent implements OnDestroy {
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
}
