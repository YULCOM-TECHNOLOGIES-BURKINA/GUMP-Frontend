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
  private apiUrlFind = 'https://gump-gateway.yulpay.com/api/users';
  private apiNES = 'http://195.35.48.198:8083/api';

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

  verifyIfu(ifuNumber: string): Observable<any> {
      return this.http.get(
          `${this.apiUrl}/get-ifu/${ifuNumber}?service=users-ms`
      );
  }

  // verifyNes(nes: string): Observable<any> {
  //   return this.http.get(
  //       `${this.apiUrl}/verify_esintax/${nes}?service=users-ms`
  //   );
  // }

  verifyNes(vData: any): Observable<any> {
      return this.http.post(
          `${this.apiNES}/verify_esyntax`, vData
      );
  }

  getUserByIfu(ifuNumber: string): Observable<any> {
      return this.http.get(
          `${this.apiUrlFind}/${ifuNumber}/find?service=users-ms`
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

  register(userData: any): Observable<any> {
      return this.http.post(
          `${this.apiUrl}/auth/register?service=users-ms`,
          userData
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
