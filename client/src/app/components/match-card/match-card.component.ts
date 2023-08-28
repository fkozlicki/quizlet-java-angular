import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [@shake]="mismatch ? 'shake' : 'initial'"
      (@shake.done)="onShakeDone()"
      [@minimize]="match ? 'minimize' : 'initial'"
      (click)="onClick()"
      [ngClass]="{
        'border-blue-500 bg-blue-50': selected,
        'hover:bg-gray-100': !selected && !mismatch && !match,
        'border-orange-500 bg-orange-50': mismatch,
        'border-green-500 bg-green-50': match
      }"
      class="grid h-full w-full cursor-pointer place-items-center rounded-2xl border-2 border-gray-300 bg-white"
    >
      {{ content }}
    </div>
  `,
  styles: [],
  animations: [
    trigger('shake', [
      state('initial', style({ transform: 'rorate(0deg)' })),
      transition(
        'initial => shake',
        animate(
          '150ms',
          keyframes([
            style({ transform: 'rotate(0deg)' }),
            style({ transform: 'rotate(5deg)' }),
            style({ transform: 'rotate(-5deg)' }),
            style({ transform: 'rotate(0deg)' }),
          ]),
        ),
      ),
    ]),
    trigger('minimize', [
      state('initial', style({ transform: 'scale(1)' })),
      state('minimize', style({ transform: 'scale(0)' })),
      transition(
        'initial => minimize',
        animate(
          '150ms',
          keyframes([
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(0)' }),
          ]),
        ),
      ),
    ]),
  ],
})
export class MatchCardComponent {
  @Input() content!: string;
  @Input() selected!: boolean;
  @Output() select = new EventEmitter();
  @Output() clearMismatch = new EventEmitter();
  @Input() mismatch: boolean = false;
  @Input() match: boolean = false;

  onShakeDone() {
    this.clearMismatch.emit();
  }

  onClick() {
    this.select.emit();
  }
}
