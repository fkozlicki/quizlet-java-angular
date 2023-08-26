import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class HomeGuardService {
  constructor(private router: Router) {}

  canActivate() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const authResponse = JSON.parse(storedUser);
      const token = authResponse.token;
      if (token) {
        const jwtHelper = new JwtHelperService();
        const isTokenNonExpired = !jwtHelper.isTokenExpired(token);
        if (isTokenNonExpired) {
          this.router.navigate(['latest']);
          return false;
        }
      }
    }

    return true;
  }
}
