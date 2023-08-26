import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderService } from 'src/app/services/folder.service';
import { ActivatedRoute } from '@angular/router';
import { SubscribeDirective } from '@ngneat/subscribe';
import { PicturePlaceholderComponent } from 'src/app/components/picture-placeholder/picture-placeholder.component';
import { StudysetPreviewComponent } from 'src/app/components/studyset-preview/studyset-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { ManageFolderModalComponent } from 'src/app/components/manage-folder-modal/manage-folder-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from 'src/app/components/delete-modal/delete-modal.component';
import { FolderModalComponent } from 'src/app/components/folder-modal/folder-modal.component';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [
    CommonModule,
    SubscribeDirective,
    PicturePlaceholderComponent,
    StudysetPreviewComponent,
    MatButtonModule,
    ManageFolderModalComponent,
    MatIconModule,
  ],
  template: `
    <div class="m-auto h-full max-w-7xl px-4">
      <div>
        <div *ngIf="folderQuery.data as folder">
          <div class="mb-4 flex flex-wrap items-center justify-between">
            <div class="flex items-center gap-10">
              <div class="font-medium text-gray-700">
                {{ folder.studySets.length }} set{{
                  folder.studySets.length > 1 ? 's' : ''
                }}
              </div>
              <div class="flex items-center gap-2">
                <div class="font-medium text-gray-500">created by</div>
                <app-picture-placeholder
                  [size]="'small'"
                ></app-picture-placeholder>
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
          <div class="mb-8 flex items-center gap-4">
            <mat-icon
              [ngStyle]="{
                'font-size': '50px',
                width: '50px',
                height: '50px'
              }"
              >folder_open</mat-icon
            >
            <div class="text-4xl font-bold">
              {{ folder.name }}
            </div>
          </div>
          <div
            *ngIf="folder.studySets.length === 0"
            class="flex h-full items-center justify-center"
          >
            <div>
              <div>This folder has no sets yet</div>
              <div>Organize all your study sets with folders.</div>
              <button (click)="openDialog()" mat-flat-button color="primary">
                Add a set
              </button>
            </div>
          </div>
          <div
            *ngFor="let studySet of folder.studySets"
            class="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <app-studyset-preview
              [id]="studySet.id"
              [title]="studySet.title"
              [termsCount]="studySet.flashcards.length"
              [userName]="studySet.user.name"
            ></app-studyset-preview>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class FolderComponent implements OnInit, OnDestroy {
  userId = +this.route.snapshot.params['userId'];
  folderId = +this.route.snapshot.params['folderId'];
  folderQuery: any;
  folder: any;
  dialogRef?: MatDialogRef<ManageFolderModalComponent>;

  constructor(
    private folderService: FolderService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.folderService.getFolder(this.folderId).result$.subscribe((data) => {
      this.folderQuery = data;
      this.folder = data.data;
    });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }

  openDialog() {
    this.dialogRef = this.dialog.open(ManageFolderModalComponent, {
      data: {
        folderId: this.folderId,
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
        id: this.folderId,
        type: 'folder',
      },
    });
  }
}
