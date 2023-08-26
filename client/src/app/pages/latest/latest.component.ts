import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeDirective } from '@ngneat/subscribe';
import { StudySetService } from 'src/app/services/study-set.service';
import { SessionService } from 'src/app/services/session.service';
import { StudysetPreviewComponent } from 'src/app/components/studyset-preview/studyset-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [
    CommonModule,
    SubscribeDirective,
    StudysetPreviewComponent,
    MatButtonModule,
    RouterModule,
  ],
  template: `
    <div class="m-auto max-w-7xl">
      <div *ngIf="studySetsResult?.data as studySets">
        <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <app-studyset-preview
            *ngFor="let studySet of studySets"
            [id]="studySet.id"
            [title]="studySet.title"
            [termsCount]="studySet.flashcards.length"
            [userName]="studySet.user.name"
          ></app-studyset-preview>
        </div>
        <div *ngIf="studySets.length === 0" class="flex justify-center">
          <div class="text-center">
            <div class="mb-5 text-3xl font-bold">
              You don't have any study sets yet.
            </div>
            <a [routerLink]="['/create-set']" mat-flat-button color="primary"
              >Create set</a
            >
          </div>
        </div>
      </div>
      <div *ngIf="studySetsResult.isLoading"></div>
    </div>
  `,
  styles: [],
})
export class LatestComponent implements OnInit {
  studySetsResult: any;

  constructor(
    private studySetService: StudySetService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    const user = this.sessionService.user;
    if (user) {
      this.studySetsResult = this.studySetService
        .getUserSets(user.id)
        .result$.subscribe((data) => {
          this.studySetsResult = data;
        });
    }
  }
}
