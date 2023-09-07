import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderService } from 'src/app/services/folder.service';
import { SessionService } from 'src/app/services/session.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SubscribeDirective } from '@ngneat/subscribe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FolderModalComponent } from '../folder-modal/folder-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-manage-study-set-modal',
  standalone: true,
  imports: [
    CommonModule,
    SubscribeDirective,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="relative w-[750px] p-6">
      <button (click)="closeAddToFolder()" class="absolute right-4 top-4">
        <mat-icon>close</mat-icon>
      </button>
      <div class="mb-8 text-3xl font-bold">Add to folder</div>
      <div *subscribe="userFoldersQuery.result$ as folders">
        <div *ngIf="folders.data as folders">
          <div *ngIf="folders.length === 0" class="flex justify-center">
            <div class="text-center">
              <div class="mb-4 text-xl font-semibold">
                You have no folders yet.
              </div>
              <button
                mat-flat-button
                color="primary"
                (click)="openCreateFolder()"
              >
                Create folder
              </button>
            </div>
          </div>
          <div
            *ngFor="let folder of folders"
            (click)="
              isInFolder(folder.studySets)
                ? removeSet(folder.id)
                : addSet(folder.id)
            "
            class="flex cursor-pointer items-center justify-between p-4 hover:bg-indigo-50"
          >
            <div class="font-medium">{{ folder.name }}</div>
            <div *ngIf="isInFolder(folder.studySets)">
              <mat-icon>remove</mat-icon>
            </div>
            <div *ngIf="!isInFolder(folder.studySets)">
              <mat-icon>add</mat-icon>
            </div>
          </div>
        </div>
        <mat-spinner *ngIf="folders.isLoading"></mat-spinner>
      </div>
    </div>
  `,
  styles: [],
})
export class ManageStudySetModalComponent {
  userId = this.sessionService.user?.id;
  userFoldersQuery = this.folderService.getUserFolders(this.userId!);
  addSetMutation$ = this.folderService.addStudySet();
  removeSetMutation$ = this.folderService.removeStudySet();

  constructor(
    private folderService: FolderService,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) private setId: number,
    private addToFolderModal: MatDialogRef<ManageStudySetModalComponent>,
    private dialog: MatDialog,
  ) {}

  openCreateFolder() {
    this.closeAddToFolder();
    this.dialog.open(FolderModalComponent, {
      data: {
        type: 'create',
      },
    });
  }

  closeAddToFolder(): void {
    this.addToFolderModal.close();
  }

  isInFolder(studySets: StudySet[]): boolean {
    return studySets.some((set) => set.id === this.setId);
  }

  addSet(folderId: number) {
    this.addSetMutation$
      .mutate({
        studySetId: this.setId,
        folderId,
      })
      .then(() => {
        this.userFoldersQuery.refetch();
      });
  }

  removeSet(folderId: number) {
    this.removeSetMutation$
      .mutate({
        studySetId: this.setId,
        folderId,
      })
      .then(() => {
        this.userFoldersQuery.refetch();
      });
  }
}
