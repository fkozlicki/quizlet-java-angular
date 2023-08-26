import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UseMutation, UseQuery } from '@ngneat/query';

interface RegisterBody {
  birthday: string;
  email: string;
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/user';
  private useMutation = inject(UseMutation);
  private useQuery = inject(UseQuery);

  constructor(private http: HttpClient) {}

  register(openLoginModal: () => void) {
    return this.useMutation(
      (body: RegisterBody) => this.http.post(`${this.apiUrl}/register`, body),
      {
        onSuccess() {
          openLoginModal();
        },
        onError(error) {
          console.error(error);
        },
      },
    );
  }

  getUser(id: number) {
    return this.useQuery(['user'], () =>
      this.http.get<User>(`${this.apiUrl}/${id}`),
    );
  }
}
