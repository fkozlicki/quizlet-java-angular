import { Injectable } from '@angular/core';

interface SessionUser extends User {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public user?: SessionUser;

  loadUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  saveUser(user: SessionUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  clearUser() {
    localStorage.removeItem('user');
    this.user = undefined;
  }
}
