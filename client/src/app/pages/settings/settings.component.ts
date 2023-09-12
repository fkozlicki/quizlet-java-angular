import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { SessionService } from 'src/app/services/session.service';
import { PicturePlaceholderComponent } from 'src/app/components/picture-placeholder/picture-placeholder.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, PicturePlaceholderComponent],
  template: `
    <div class="mx-4 max-w-screen-lg py-12 sm:mx-6 lg:m-auto">
      <div class="mb-8 flex flex-col lg:flex-row lg:items-center lg:gap-8">
        <div class="mb-4 flex items-center gap-4 lg:basis-48 lg:flex-col">
          <div class="text-xl font-semibold">Profile Picture</div>
          <img
            *ngIf="imageUrl"
            [ngSrc]="imageUrl"
            alt="profile image"
            width="80"
            height="80"
            class="rounded-full"
          />
          <app-picture-placeholder
            *ngIf="!imageUrl"
            [size]="'large'"
          ></app-picture-placeholder>
        </div>
        <div class="flex-1 rounded-lg bg-white p-4 shadow">
          <div class="mb-4">Choose your profile picture</div>
          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let image of images"
              class="overflow-hidden rounded-full"
              (click)="changeImage(image)"
            >
              <img
                [ngSrc]="'/assets/images/' + image"
                alt=""
                width="48"
                height="48"
              />
            </button>
          </div>
          <div class="mb-4 flex items-center">
            <div class="h-px flex-1 bg-gradient-to-l from-slate-300"></div>
            <div class="mx-2">or</div>
            <div class="h-px flex-1 bg-gradient-to-r from-slate-300"></div>
          </div>
          <label
            for="profile-picture"
            class="m-auto block w-max cursor-pointer rounded-md bg-cyan-400 px-4 py-2 font-medium text-white hover:bg-cyan-500"
          >
            Upload your own picture
            <input
              name="profile-picture"
              type="file"
              id="profile-picture"
              class="hidden"
              (change)="onChange($event)"
              accept="image/jpeg"
            />
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SettingsComponent {
  imageUrl = this.sessionService.user!.imageUrl;
  images = ['bear.jpg', 'cat.jpg', 'owl.jpg', 'flaming.jpg'];

  constructor(
    private userService: UserService,
    public sessionService: SessionService,
  ) {}

  changeImage(image: string) {
    const imageUrl = `/assets/images/${image}`;

    this.userService
      .editUser()
      .mutate({
        id: this.sessionService.user!.id,
        imageUrl,
      })
      .then(() => {
        this.sessionService.saveUser({
          ...this.sessionService.user!,
          imageUrl: imageUrl,
        });

        this.imageUrl = imageUrl;
      });
  }

  onChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.userService
        .uploadPicture()
        .mutate({
          formData,
        })
        .then(() => {
          this.userService
            .getUser(this.sessionService.user!.id)
            .result$.subscribe((result) => {
              if (result.data) {
                this.sessionService.saveUser({
                  ...this.sessionService.user!,
                  imageUrl: result.data.imageUrl,
                });

                this.imageUrl = result.data.imageUrl;
              }
            });
        })
        .catch();
    }
  }
}
