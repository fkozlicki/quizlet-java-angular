import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PicturePlaceholderComponent } from '../picture-placeholder/picture-placeholder.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-studyset-preview',
  standalone: true,
  imports: [CommonModule, PicturePlaceholderComponent, RouterModule],
  template: `
    <a
      [routerLink]="'/study-set/' + id"
      class="flex min-h-[150px] flex-col justify-between rounded-2xl bg-white p-4"
    >
      <div>
        <div class="mb-2">{{ title }}</div>
        <div class="flex">
          <div class="rounded-full bg-indigo-50 px-2 py-[2px] text-xs">
            {{ termsCount }} terms
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <app-picture-placeholder [size]="'small'"></app-picture-placeholder>
        <div>{{ userName }}</div>
      </div>
    </a>
  `,
  styles: [],
})
export class StudysetPreviewComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() termsCount!: number;
  @Input() userName!: string;
}
