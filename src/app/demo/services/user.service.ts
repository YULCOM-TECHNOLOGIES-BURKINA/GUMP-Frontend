import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur, CreateUserRequest } from '../models/utilisateurs';
import { User, UserResponse } from '../models/utilisateurs';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://gump-gateway.yulpay.com/api';
  private apiUrlFind = 'https://gump-gateway.yulpay.com/api/users';

  constructor(private http: HttpClient) {}

  private token = localStorage.getItem('currentToken');

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  private getFormDataHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  verifyIfu(ifuNumber: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/get-ifu/${ifuNumber}?service=users-ms`, {
        headers: this.getFormDataHeaders()
    });
  }

  getUserByIfu(ifuNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrlFind}/${ifuNumber}/find?service=users-ms`);
  }


 approveUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/approve?service=users-ms`, {
        headers: this.getFormDataHeaders()
    });
 }

 rejectUser(userId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/users/${userId}/reject?service=users-ms`, {
      headers: this.getFormDataHeaders()
  });
}

  register(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/auth/register?service=users-ms`, userData, {
          headers: this.getHeaders()
    });
  }
                        

  getUsers(): Observable<Utilisateur[]> {
      return this.http.get<Utilisateur[]>(`${this.apiUrl}/users?service=users-ms`, {
        headers: this.getFormDataHeaders()
    });
  }

  getUsersCompany(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users?service=users-ms`, {
        headers: this.getFormDataHeaders()
    });
}


  submitUserRequest(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/submit`, formData, {
        headers: this.getFormDataHeaders()
      });
  }
}
