import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from 'src/app/components/user-layout/user-layout.component';
import { StudySetService } from 'src/app/services/study-set.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscribeDirective } from '@ngneat/subscribe';
import { PicturePlaceholderComponent } from 'src/app/components/picture-placeholder/picture-placeholder.component';

@Component({
  selector: 'app-study-sets',
  standalone: true,
  imports: [
    CommonModule,
    UserLayoutComponent,
    SubscribeDirective,
    PicturePlaceholderComponent,
    RouterModule,
  ],
  template: `
    <app-user-layout>
      <div *subscribe="studySetsQuery$ as studySetsQuery">
        <div
          *ngIf="studySetsQuery.data as studySets"
          class="flex flex-col gap-4"
        >
          <a
            *ngFor="let studySet of studySets"
            [routerLink]="['/study-set', studySet.id]"
            class="rounded bg-white p-3 shadow-md"
          >
            <div class="flex items-center gap-8">
              <div class="font-medium">
                {{ studySet.flashcards.length }} terms
              </div>
              <div class="flex items-center gap-2">
                <app-picture-placeholder
                  [size]="'small'"
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
