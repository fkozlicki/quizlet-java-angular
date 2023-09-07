import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-folder-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
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
        {{ folderName }}
      </div>
    </div>
  `,
  styles: [],
})
export class FolderHeaderComponent {
  @Input() folderName!: string;
}
