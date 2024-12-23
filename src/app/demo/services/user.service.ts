import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateurs';
import { UserResponse } from '../models/utilisateurs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://gump-gateway.yulpay.com/api';

  constructor(private http: HttpClient) {}

  private token = localStorage.getItem('currentToken');

  private getHeaders(): HttpHeaders {
      return new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
      });
  }

  private getFormDataHeaders(): HttpHeaders {
      return new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
      });
  }

  private getHeadersMultipart(): HttpHeaders {
    return new HttpHeaders({
        'Content-Type': 'multipart/form-data',
    });
}

  verifyIfu(ifuNumber: string): Observable<any> {
      return this.http.get(
          `${this.apiUrl}/get-ifu/${ifuNumber}?service=users-ms`
      );
  }

  verifyNes(vData: any): Observable<any> {
      return this.http.post(
          `${this.apiUrl}/verify_esyntax?service=asf-ms`, vData
      );
  }

  getUserByIfu(ifuNumber: string): Observable<any> {
      return this.http.get(
          `${this.apiUrl}/users/${ifuNumber}/find?service=users-ms`,
          {
              headers: this.getFormDataHeaders(),
          }
      );
  }

getMe(): Observable<any> {
    return this.http.get(
        `${this.apiUrl}/users/me?service=users-ms`,
        {
            headers: this.getFormDataHeaders(),
        }
    );
}

saveMe(userData: any): Observable<any> {
    return this.http.post(
        `${this.apiUrl}/users/me?service=users-ms`, userData,
        {
            headers: this.getHeaders(),
        }
    );
}

  approveUser(userId: number): Observable<any> {
      return this.http.post(
          `${this.apiUrl}/users/${userId}/approve?service=users-ms`,
          {
              headers: this.getFormDataHeaders(),
          }
      );
  }

  rejectUser(userId: number): Observable<any> {
      return this.http.post(
          `${this.apiUrl}/users/${userId}/reject?service=users-ms`,
          {
              headers: this.getFormDataHeaders(),
          }
      );
  }

  register(formData: FormData): Observable<any> {
      return this.http.post(
          `${this.apiUrl}/auth/register?service=users-ms`,
          formData
      );
  }

  getUsers(): Observable<Utilisateur[]> {
      return this.http.get<Utilisateur[]>(
          `${this.apiUrl}/users?service=users-ms`,
          {
              headers: this.getFormDataHeaders(),
          }
      );
  }

  getUsersCompany(): Observable<UserResponse> {
      return this.http.get<UserResponse>(
          `${this.apiUrl}/users?service=users-ms`,
          {
              headers: this.getFormDataHeaders(),
          }
      );
  }
}
