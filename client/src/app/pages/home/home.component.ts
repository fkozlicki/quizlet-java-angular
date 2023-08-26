import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="flex w-full flex-1">
    <div class="text-2xl font-bold text-indigo-500">Welcome to Quizletv2</div>
  </div>`,
  styles: [],
})
export class HomeComponent {
  constructor() {}
}
