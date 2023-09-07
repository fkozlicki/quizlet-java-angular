import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from 'src/app/components/user-layout/user-layout.component';
import { FolderService } from 'src/app/services/folder.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscribeDirective } from '@ngneat/subscribe';
import { MatDialog } from '@angular/material/dialog';
import { FolderModalComponent } from 'src/app/components/folder-modal/folder-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-folders',
  standalone: true,
  imports: [
    CommonModule,
    UserLayoutComponent,
    SubscribeDirective,
    RouterModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <app-user-layout>
      <div *subscribe="foldersQuery$ as foldersQuery" class="h-full">
        <mat-spinner *ngIf="foldersQuery.isLoading"></mat-spinner>
        <div *ngIf="foldersQuery.data as folders" class="h-full">
          <div
            *ngIf="folders.length === 0"
            class="grid h-full place-items-center"
          >
            <div class="text-center">
              <div class="mb-4 text-3xl font-bold">
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
          <div *ngIf="folders.length > 0" class="flex flex-col gap-4">
            <a
              *ngFor="let folder of folders"
              [routerLink]="['/', userId, 'folders', folder.id]"
              class="rounded bg-white p-3 shadow-md"
            >
              <div class="font-medium">{{ folder.studySets.length }} sets</div>
              <div class="text-xl font-bold">
                {{ folder.name }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </app-user-layout>
  `,
  styles: [],
})
export class FoldersComponent {
  userId = +this.route.snapshot.params['userId'];
  foldersQuery$ = this.folderService.getUserFolders(this.userId).result$;

  constructor(
    private folderService: FolderService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  openCreateFolder() {
    this.dialog.open(FolderModalComponent, {
      data: {
        type: 'create',
      },
    });
  }
}
