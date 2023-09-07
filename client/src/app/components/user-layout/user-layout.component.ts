import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscribeDirective } from '@ngneat/subscribe';
import { PicturePlaceholderComponent } from '../picture-placeholder/picture-placeholder.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    SubscribeDirective,
    PicturePlaceholderComponent,
    RouterModule,
  ],
  template: `
    <div class="m-auto flex h-full max-w-7xl flex-col">
      <div *subscribe="userQuery$ as userQuery">
        <div *ngIf="userQuery.data as user">
          <div class="mb-6 flex items-center gap-6">
            <app-picture-placeholder [size]="'large'"></app-picture-placeholder>
            <div>
              <div>{{ user.name }}</div>
            </div>
          </div>
          <div class="mb-8 border-b-2">
            <div class="flex items-center gap-5">
              <a
                [routerLink]="'/' + userId"
                [ngClass]="
                  path === userId.toString() ? 'before:block' : 'before:hidden'
                "
                class="relative pb-1 font-semibold before:absolute before:left-0 before:top-full before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block"
                >Achivements</a
              ><a
                [ngClass]="
                  path === userId + '/study-sets'
                    ? 'before:block'
                    : 'before:hidden'
                "
                [routerLink]="'/' + userId + '/study-sets'"
                class="relative pb-1 font-semibold text-gray-500 before:absolute before:left-0 before:top-full before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block"
                >Study sets</a
              ><a
                [ngClass]="
                  path === userId + '/folders'
                    ? 'before:block'
                    : 'before:hidden'
                "
                [routerLink]="'/' + userId + '/folders'"
                class="relative pb-1 font-semibold text-gray-500 before:absolute before:left-0 before:top-full before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block"
                >Folders</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [],
})
export class UserLayoutComponent implements OnInit {
  userId = +this.route.snapshot.params['userId'];
  userQuery$ = this.userService.getUser(this.userId).result$;
  path?: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.path = url.join('/');
    });
  }
}
