import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UseMutation } from '@ngneat/query';

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';
  private useMutation = inject(UseMutation);

  constructor(private http: HttpClient) {}

  login() {
    return this.useMutation(
      (body: LoginBody) =>
        this.http.post<LoginResponse>(`${this.apiUrl}/login`, body),
      {
        onSuccess: ({ token, user }) => {
          localStorage.setItem('user', JSON.stringify({ ...user, token }));
        },
        onError(error) {
          console.error(error);
        },
      },
    );
  }
}
