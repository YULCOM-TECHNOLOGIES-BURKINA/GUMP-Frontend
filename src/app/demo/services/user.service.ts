import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateurs';
import { User, UserResponse } from '../models/utilisateurs';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://gump-gateway.yulpay.com/api';
  private apiUrlFind = 'https://gump-gateway.yulpay.com/api/users';

  constructor(private http: HttpClient) {}

  verifyIfu(ifuNumber: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/get-ifu/${ifuNumber}?service=users-ms`);
  }

  getUserByIfu(ifuNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrlFind}/${ifuNumber}/find?service=users-ms`);
}

  register(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/auth/register?service=users-ms`, userData, {
          headers: { 'Content-Type': 'application/json' },
      });
  }

  getUsers(): Observable<Utilisateur[]> {
      return this.http.get<Utilisateur[]>(`${this.apiUrl}/users?service=users-ms`);
  }

  getUsersCompany(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users?service=users-ms`);
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
