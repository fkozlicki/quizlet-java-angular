import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UseMutation, UseQuery } from '@ngneat/query';

interface CreateStudySetBody {
  title: string;
  description: string | null;
  flashcards: Omit<Flashcard, 'id'>[];
}

interface EditStudySetBody extends CreateStudySetBody {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class StudySetService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/study-set';
  private useMutation = inject(UseMutation);
  private useQuery = inject(UseQuery);

  constructor(private http: HttpClient) {}

  createStudySet() {
    return this.useMutation((body: CreateStudySetBody) =>
      this.http.post<StudySet>(`${this.apiUrl}/create`, body),
    );
  }

  editStudySet() {
    return this.useMutation((body: EditStudySetBody) =>
      this.http.put<StudySet>(`${this.apiUrl}/edit`, body),
    );
  }

  getUserSets(userId: number) {
    return this.useQuery(['userSets'], () => {
      return this.http.get<StudySet[]>(`${this.apiUrl}/list/${userId}`);
    });
  }

  getStudySet(id: number) {
    return this.useQuery(['studySet'], () => {
      return this.http.get<StudySet>(`${this.apiUrl}/${id}`);
    });
  }

  deleteStudySet() {
    return this.useMutation((id: number) =>
      this.http.delete(`${this.apiUrl}/${id}`),
    );
  }
}
