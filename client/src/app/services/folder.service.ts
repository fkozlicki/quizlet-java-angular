import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UseMutation, UseQuery } from '@ngneat/query';

interface CreateFolderBody {
  name: string;
  description: string | null;
}

interface EditFolderBody extends CreateFolderBody {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/folder';
  private useMutation = inject(UseMutation);
  private useQuery = inject(UseQuery);

  constructor(private http: HttpClient) {}

  createFolder() {
    return this.useMutation((body: CreateFolderBody) =>
      this.http.post(`${this.apiUrl}/create`, body),
    );
  }

  deleteFolder() {
    return this.useMutation((id: number) =>
      this.http.delete(`${this.apiUrl}/${id}`),
    );
  }

  editFolder() {
    return this.useMutation((body: EditFolderBody) =>
      this.http.put<Folder>(`${this.apiUrl}/edit`, body),
    );
  }

  getFolder(folderId: number) {
    return this.useQuery(['folder'], () =>
      this.http.get<Folder>(`${this.apiUrl}/${folderId}`),
    );
  }

  getUserFolders(userId: number) {
    return this.useQuery(['userFolders'], () =>
      this.http.get<Folder[]>(`${this.apiUrl}/list/${userId}`),
    );
  }

  addStudySet() {
    return this.useMutation(
      ({ folderId, studySetId }: { folderId: number; studySetId: number }) =>
        this.http.post(`${this.apiUrl}/add-set`, null, {
          params: {
            folderId,
            studySetId,
          },
        }),
    );
  }

  removeStudySet() {
    return this.useMutation(
      ({ folderId, studySetId }: { folderId: number; studySetId: number }) =>
        this.http.post(`${this.apiUrl}/remove-set`, null, {
          params: {
            folderId,
            studySetId,
          },
        }),
    );
  }
}
