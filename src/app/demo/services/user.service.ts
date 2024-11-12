import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://195.35.48.198:8081/api';

  constructor(private http: HttpClient) {}

  verifyIfu(ifuNumber: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/get-ifu/${ifuNumber}`);
  }

  register(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/auth/register`, userData, {
          headers: { 'Content-Type': 'application/json' },
      });
  }

  getUsers(): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  desactivateUser(id: number): Observable<any> {
      return this.http.patch(`${this.apiUrl}/${id}/desactiver`, {});
  }

  deleteUser(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
  }

  submitUserRequest(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/submit`, formData);
  }
}
