import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from 'src/app/components/user-layout/user-layout.component';
import { FolderService } from 'src/app/services/folder.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscribeDirective } from '@ngneat/subscribe';

@Component({
  selector: 'app-folders',
  standalone: true,
  imports: [
    CommonModule,
    UserLayoutComponent,
    SubscribeDirective,
    RouterModule,
  ],
  template: `
    <app-user-layout>
      <div *subscribe="foldersQuery$ as foldersQuery">
        <div *ngIf="foldersQuery.data as folders" class="flex flex-col gap-4">
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
  ) {}
}
