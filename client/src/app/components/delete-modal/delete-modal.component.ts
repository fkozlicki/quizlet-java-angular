import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { StudySetService } from 'src/app/services/study-set.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubscribeDirective } from '@ngneat/subscribe';
import { Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, SubscribeDirective],
  template: `
    <div
      class="w-[350px] p-6 md:w-[550px]"
      *subscribe="deleteFolderMutation.result$ as deleteFolder"
    >
      <div class="mb-8 text-lg font-semibold">
        Are you sure you want to delete this
        {{ data.type === 'folder' ? 'folder' : 'study set' }}?
      </div>
      <div
        *subscribe="deleteStudySetMutation.result$ as deleteStudySet"
        class="flex justify-end gap-4"
      >
        <button
          (click)="close()"
          [disabled]="deleteStudySet.isLoading || deleteFolder.isLoading"
          class="rounded px-3 py-2 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          (click)="onDelete()"
          [disabled]="deleteStudySet.isLoading || deleteFolder.isLoading"
          mat-flat-button
          color="warn"
        >
          Delete
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class DeleteModalComponent {
  deleteStudySetMutation = this.studySetService.deleteStudySet();
  deleteFolderMutation = this.folderService.deleteFolder();

  constructor(
    private dialogRef: MatDialogRef<DeleteModalComponent>,
    private studySetService: StudySetService,
    private folderService: FolderService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: { type: 'folder' | 'study-set'; id: number },
  ) {}

  onDelete() {
    if (this.data.type === 'folder') {
      this.deleteFolderMutation.mutate(this.data.id).then(() => {
        this.router.navigate(['/latest']);
        this.close();
      });
    } else {
      this.deleteStudySetMutation.mutate(this.data.id).then(() => {
        this.router.navigate(['/latest']);
        this.close();
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
