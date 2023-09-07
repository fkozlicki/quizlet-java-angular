import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeDirective } from '@ngneat/subscribe';
import { UserLayoutComponent } from 'src/app/components/user-layout/user-layout.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, SubscribeDirective, UserLayoutComponent],
  template: `<app-user-layout>
    <div class="grid h-full place-items-center">
      <div class="text-3xl font-bold">WIP</div>
    </div>
  </app-user-layout> `,
  styles: [],
})
export class UserComponent {}
