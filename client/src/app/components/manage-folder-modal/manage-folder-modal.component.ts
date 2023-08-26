import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { StudySetService } from 'src/app/services/study-set.service';
import { SubscribeDirective } from '@ngneat/subscribe';
import { FolderService } from 'src/app/services/folder.service';
import { QueryClientService } from '@ngneat/query';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-folder-modal',
  standalone: true,
  imports: [CommonModule, RouterModule, SubscribeDirective, MatIconModule],
  template: `
    <div class="min-w-[350px] sm:min-w-[600px]">
      <div class="bg-blue-800 p-6">
        <div class="flex justify-between">
          <div class="text-2xl font-bold text-white">Add a set</div>
          <button
            (click)="close()"
            class="grid h-10 w-10 place-items-center rounded-full border-[3px] border-blue-900 text-white hover:bg-blue-900"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      <div *subscribe="studySetsQuery$ as studySets" class="bg-slate-200 p-8">
        <a
          class="group mb-6 flex w-full justify-center bg-white p-6"
          [routerLink]="'/create-set'"
          ><div class="">
            <div
              class="mb-2 font-semibold uppercase group-hover:text-yellow-300"
            >
              + create a new set
            </div>
            <div
              class="h-[5px] w-full bg-cyan-500 group-hover:bg-yellow-300"
            ></div></div
        ></a>
        <div *ngIf="studySets.data as studySets" class="flex flex-col gap-4">
          <div
            *ngFor="let studySet of studySets"
            class="flex items-center justify-between rounded bg-white p-4"
          >
            <div class="text-xl font-bold">{{ studySet.title }}</div>
            <button
              *ngIf="folderSetsIds.includes(studySet.id)"
              (click)="removeSet(studySet.id)"
              class="group flex items-center rounded border-2 border-slate-300  px-4 py-2"
            >
              <mat-icon>remove</mat-icon>
            </button>
            <button
              *ngIf="!folderSetsIds.includes(studySet.id)"
              (click)="addSet(studySet.id)"
              class="group flex items-center rounded border-2 border-slate-300 px-4 py-2"
            >
              <mat-icon>add</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ManageFolderModalComponent {
  studySetsQuery$ = this.studySetService.getUserSets(this.data.userId).result$;
  folderSetsIds = this.data.folderSets.map((set: any) => set.id);
  addSetMutation$ = this.folderService.addStudySet();
  removeSetMutation$ = this.folderService.removeStudySet();
  private queryClient = inject(QueryClientService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studySetService: StudySetService,
    private folderService: FolderService,
    private dialogRef: MatDialogRef<ManageFolderModalComponent>,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  addSet(studySetId: number) {
    this.addSetMutation$
      .mutate({
        folderId: this.data.folderId,
        studySetId,
      })
      .then((data: any) => {
        this.queryClient.invalidateQueries(['folder']);
        this.folderSetsIds = data.map((set: any) => set.id);
      });
  }

  removeSet(studySetId: number) {
    this.removeSetMutation$
      .mutate({
        folderId: this.data.folderId,
        studySetId,
      })
      .then((data: any) => {
        this.queryClient.invalidateQueries(['folder']);
        this.folderSetsIds = data.map((set: any) => set.id);
      });
  }
}
