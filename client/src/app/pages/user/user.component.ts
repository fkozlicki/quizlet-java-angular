import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeDirective } from '@ngneat/subscribe';
import { UserLayoutComponent } from 'src/app/components/user-layout/user-layout.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, SubscribeDirective, UserLayoutComponent],
  template: `<app-user-layout></app-user-layout> `,
  styles: [],
})
export class UserComponent {}
