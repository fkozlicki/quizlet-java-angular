import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderService } from 'src/app/services/folder.service';
import { ActivatedRoute } from '@angular/router';
import { SubscribeDirective } from '@ngneat/subscribe';
import { StudysetPreviewComponent } from 'src/app/components/studyset-preview/studyset-preview.component';
import { FolderCtaComponent } from 'src/app/components/folder-cta/folder-cta.component';
import { FolderHeaderComponent } from 'src/app/components/folder-header/folder-header.component';
import { FolderEmptyComponent } from 'src/app/components/folder-empty/folder-empty.component';
import { QueryObserverResult } from '@tanstack/query-core';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [
    CommonModule,
    SubscribeDirective,
    StudysetPreviewComponent,
    FolderCtaComponent,
    FolderHeaderComponent,
    FolderEmptyComponent,
  ],
  template: `
    <div class="m-auto h-full max-w-7xl px-4">
      <div *ngIf="folder.data as folder" class="flex h-full flex-col">
        <app-folder-cta [folder]="folder" [userId]="userId"></app-folder-cta>
        <app-folder-header [folderName]="folder.name"></app-folder-header>
        <div class="flex-1" *ngIf="folder.studySets.length === 0">
          <app-folder-empty [folder]="folder" [userId]="userId">
          </app-folder-empty>
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
            [imageUrl]="studySet.user.imageUrl"
          ></app-studyset-preview>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class FolderComponent implements OnInit {
  userId!: number;
  folder!: QueryObserverResult<Folder, unknown>;

  constructor(
    private folderService: FolderService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['userId'];
      this.folderService
        .getFolder(+params['folderId'])
        .result$.subscribe((result) => {
          this.folder = result;
        });
    });
  }
}
