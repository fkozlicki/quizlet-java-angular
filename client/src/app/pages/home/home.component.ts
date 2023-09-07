import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="grid h-full place-items-center">
    <div class="text-3xl font-bold text-indigo-500">Welcome to Quizletv2</div>
  </div>`,
  styles: [],
})
export class HomeComponent {
  constructor() {}
}
