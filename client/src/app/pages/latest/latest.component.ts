import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeDirective } from '@ngneat/subscribe';
import { StudySetService } from 'src/app/services/study-set.service';
import { SessionService } from 'src/app/services/session.service';
import { StudysetPreviewComponent } from 'src/app/components/studyset-preview/studyset-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [
    CommonModule,
    SubscribeDirective,
    StudysetPreviewComponent,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div *subscribe="studySets$ as studySets" class="m-auto h-full max-w-7xl">
      <div
        *ngIf="studySets.data as studySets"
        [ngClass]="{ 'h-full': studySets.length === 0 }"
      >
        <div
          *ngIf="studySets.length > 0"
          class="grid gap-3 sm:grid-cols-2 md:grid-cols-3"
        >
          <app-studyset-preview
            *ngFor="let studySet of studySets"
            [id]="studySet.id"
            [title]="studySet.title"
            [termsCount]="studySet.flashcards.length"
            [userName]="studySet.user.name"
          ></app-studyset-preview>
        </div>
        <div
          *ngIf="studySets.length === 0"
          class="grid h-full place-items-center"
        >
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
      <div *ngIf="studySets.error" class="grid h-full place-items-center">
        <div class="text-center">
          <div class="mb-5 text-3xl font-bold">
            Something went wrong. Couldn't load your study sets.
          </div>
          <button
            mat-flat-button
            color="primary"
            class="block"
            (click)="tryAgain()"
          >
            Try again
          </button>
        </div>
      </div>
      <div *ngIf="studySets.isLoading" class="grid h-full place-items-center">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [],
})
export class LatestComponent {
  studySets$ = this.studySetService.getUserSets(this.sessionService.user!.id)
    .result$;

  constructor(
    private studySetService: StudySetService,
    private sessionService: SessionService,
  ) {}

  tryAgain() {
    this.studySets$.subscribe((data) => {
      data.refetch();
    });
  }
}
