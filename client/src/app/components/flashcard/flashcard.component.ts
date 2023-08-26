import { Component, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

const flipAnimations = trigger('flipAnimations', [
  state('flipIn', style({ transform: 'rotateX(0deg)' })),
  state('flipOut', style({ transform: 'rotateX(180deg)' })),
  transition(
    'flipIn => flipOut',
    animate('250ms ease-in-out', style({ transform: 'rotateX(180deg)' })),
  ),
  transition(
    'flipOut => flipIn',
    animate('250ms ease-in-out', style({ transform: 'rotateX(360deg)' })),
  ),
]);

@Component({
  selector: 'app-flashcard',
  standalone: true,
  animations: [flipAnimations],
  imports: [MatProgressBarModule, MatIconModule, MatButtonModule, CommonModule],
  template: `
    <div
      (click)="toggleFlip()"
      class="mb-5 h-[25rem] w-full cursor-pointer [perspective:1000px]"
    >
      <div
        [@flipAnimations]="flip ? 'flipOut' : 'flipIn'"
        class="relative h-full w-full rounded-lg [transform-style:preserve-3d]"
      >
        <div
          class="absolute h-full w-full shadow-lg [backface-visibility:hidden]"
        >
          <div
            class="h-full w-full rounded-lg bg-white p-4 drop-shadow-lg md:p-6"
          >
            <div class="flex h-full flex-col">
              <div class="flex items-center justify-between">
                <div class="flex flex-1 justify-end gap-2">
                  <button
                    class="rounded-full p-2 text-slate-500 hover:bg-gray-100 hover:text-slate-800"
                  ></button
                  ><button
                    class="rounded-full p-2 text-slate-500 hover:bg-gray-100 hover:text-slate-800"
                  ></button>
                </div>
              </div>
              <div class="flex flex-1 items-center justify-center text-3xl">
                {{ term }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute h-full w-full shadow-lg [backface-visibility:hidden] [transform:rotateX(180deg)]"
        >
          <div
            class="h-full w-full rounded-lg bg-white p-4 drop-shadow-lg md:p-6"
          >
            <div class="flex h-full flex-col">
              <div class="flex items-center justify-between">
                <div class="flex flex-1 justify-end gap-2">
                  <button
                    class="rounded-full p-2 text-slate-500 hover:bg-gray-100 hover:text-slate-800"
                  ></button
                  ><button
                    class="rounded-full p-2 text-slate-500 hover:bg-gray-100 hover:text-slate-800"
                  ></button>
                </div>
              </div>
              <div class="flex flex-1 items-center justify-center text-3xl">
                {{ definition }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FlashcardComponent {
  @Input() term!: string;
  @Input() definition!: string;
  flip = false;

  toggleFlip() {
    this.flip = !this.flip;
  }
}
