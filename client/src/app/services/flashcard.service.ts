import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UseMutation } from '@ngneat/query';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/flashcard';
  private useMutation = inject(UseMutation);

  constructor(private http: HttpClient) {}

  editFlashcard() {
    return this.useMutation((body: Flashcard) =>
      this.http.put<Flashcard>(`${this.apiUrl}/edit`, body),
    );
  }
}
