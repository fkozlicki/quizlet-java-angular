import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserLayoutComponent } from 'src/app/components/user-layout/user-layout.component';
import { StudySetService } from 'src/app/services/study-set.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscribeDirective } from '@ngneat/subscribe';
import { PicturePlaceholderComponent } from 'src/app/components/picture-placeholder/picture-placeholder.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-study-sets',
  standalone: true,
  imports: [
    CommonModule,
    UserLayoutComponent,
    SubscribeDirective,
    PicturePlaceholderComponent,
    RouterModule,
    RouterModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
  ],
  template: `
    <app-user-layout>
      <div *subscribe="studySetsQuery$ as studySetsQuery" class="h-full">
        <mat-spinner *ngIf="studySetsQuery.isLoading"></mat-spinner>
        <div *ngIf="studySetsQuery.data as studySets" class="h-full">
          <div
            *ngIf="studySets.length === 0"
            class="grid h-full place-items-center"
          >
            <div class="text-center">
              <div class="mb-4 text-3xl font-bold">
                You have no study sets yet.
              </div>
              <a [routerLink]="['/create-set']" mat-flat-button color="primary">
                Create set
              </a>
            </div>
          </div>
          <div *ngIf="studySets.length > 0" class="flex flex-col gap-4">
            <a
              *ngFor="let studySet of studySets"
              [routerLink]="['/study-set', studySet.id]"
              class="rounded bg-white p-3 shadow-md"
            >
              <div class="flex items-center gap-4">
                <div class="font-medium">
                  {{ studySet.flashcards.length }} terms
                </div>
                <div class="h-4 w-px bg-slate-200"></div>
                <div class="flex items-center gap-1">
                  <img
                    *ngIf="studySet.user.imageUrl as imageUrl"
                    [ngSrc]="imageUrl"
                    alt=""
                    width="16"
                    height="16"
                    class="rounded-full"
                  />
                  <app-picture-placeholder
                    *ngIf="!studySet.user.imageUrl"
                    [size]="'xs'"
                  ></app-picture-placeholder>
                  <div>{{ studySet.user.name }}</div>
                </div>
              </div>
              <div class="text-xl font-bold">
                {{ studySet.title }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </app-user-layout>
  `,
  styles: [],
})
export class StudySetsComponent {
  userId = +this.route.snapshot.params['userId'];
  studySetsQuery$ = this.studySetService.getUserSets(this.userId).result$;

  constructor(
    private studySetService: StudySetService,
    private route: ActivatedRoute,
  ) {}
}
