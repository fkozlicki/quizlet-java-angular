import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FolderService } from 'src/app/services/folder.service';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { QueryClientService } from '@ngneat/query';

@Component({
  selector: 'app-folder-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
  ],
  template: `
    <div class="relative sm:w-[450px] md:w-[600px] lg:w-[750px]">
      <button mat-dialog-close class="absolute right-3 top-3">
        <mat-icon
          aria-hidden="false"
          aria-label="Close"
          fontIcon="close"
        ></mat-icon>
      </button>
      <form [formGroup]="folderForm" (ngSubmit)="onSubmit()">
        <div class="flex flex-col p-8 pb-16">
          <div class="mb-4 text-3xl font-bold">
            {{ data.type === 'edit' ? 'Edit folder' : 'Create a new folder' }}
          </div>
          <input
            formControlName="name"
            class="mb-3 rounded bg-indigo-50 p-2 outline-none"
            type="text"
            placeholder="Enter a name"
            name="name"
          />
          <div *ngIf="folderForm.controls.name.hasError('required')"></div>
          <textarea
            formControlName="description"
            class="rounded bg-indigo-50 p-2 outline-none"
            placeholder="Enter a description (optional"
            name="description"
            cols="30"
            rows="3"
          ></textarea>
        </div>
        <div class="flex justify-end border-t p-4">
          <button
            [disabled]="folderForm.invalid"
            mat-flat-button
            color="primary"
          >
            {{ data.type === 'edit' ? 'Save' : 'Create folder' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class FolderModalComponent {
  folderForm = new FormGroup({
    name: new FormControl(this.data.folder?.name, {
      validators: [Validators.required],
    }),
    description: new FormControl(this.data.folder?.description),
  });
  createFolderMutation = this.folderService.createFolder();
  editFolderMutation = this.folderService.editFolder();
  private queryClient = inject(QueryClientService);

  constructor(
    private folderService: FolderService,
    private dialogRef: MatDialogRef<FolderModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { type: 'create' | 'edit'; folder?: Folder },
  ) {}

  onSubmit() {
    const { name, description } = this.folderForm.value;

    if (!name || description === undefined) {
      return;
    }

    if (this.data.type === 'create') {
      this.createFolderMutation.mutate({ name, description }).then(() => {
        this.dialogRef.close();
        this.queryClient.invalidateQueries(['userFolders']);
      });
    } else {
      if (!this.data.folder) {
        return;
      }
      this.editFolderMutation
        .mutate({ id: this.data.folder.id, name, description })
        .then(() => {
          this.dialogRef.close();
          this.queryClient.invalidateQueries(['folder']);
        });
    }
  }
}
