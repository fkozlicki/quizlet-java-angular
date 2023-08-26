import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _signupModalOpen = false;

  get signupModalOpen(): boolean {
    return this._signupModalOpen;
  }

  set signupModalOpen(value: boolean) {
    this._signupModalOpen = value;
  }
}
