import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderService } from 'src/app/services/folder.service';
import { SessionService } from 'src/app/services/session.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubscribeDirective } from '@ngneat/subscribe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-study-set-modal',
  standalone: true,
  imports: [CommonModule, SubscribeDirective, MatIconModule],
  template: `
    <div class="relative w-[750px] p-6">
      <button (click)="close()" class="absolute right-4 top-4">
        <mat-icon>close</mat-icon>
      </button>
      <div class="mb-8 text-3xl font-bold">Add to folder</div>
      <div *subscribe="userFoldersQuery.result$ as folders">
        <div *ngIf="folders.data">
          <div
            *ngFor="let folder of folders.data"
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
    private dialogRef: MatDialogRef<ManageStudySetModalComponent>,
  ) {}

  close(): void {
    this.dialogRef.close();
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
