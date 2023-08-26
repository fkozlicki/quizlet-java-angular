import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-picture-placeholder',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="flex items-center justify-center rounded-full bg-slate-500"
      [ngClass]="{
        'h-6 w-6': size === 'small',
        'h-10 w-10': size === 'medium',
        'h-12 w-12': size === 'large'
      }"
    >
      <mat-icon
        [ngClass]="{
          'h-2 w-2': size === 'small',
          'h-10 w-10': size === 'medium',
          'h-12 w-12': size === 'large'
        }"
        [ngStyle]="{
          width:
            size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
          height:
            size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
          'font-size':
            size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px'
        }"
        class="text-white"
        fontIcon="person_outline"
      ></mat-icon>
    </div>
  `,
  styles: [],
})
export class PicturePlaceholderComponent {
  @Input() size!: 'small' | 'medium' | 'large';
}
