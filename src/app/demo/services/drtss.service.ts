import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeDrtss, DemandeDrtssResponse } from '../models/drtss';
import { KeycloakAuthService } from './keycloak-auth.service'

@Injectable({
  providedIn: 'root'
})
export class DrtssService {

  constructor(private http: HttpClient, private keycloak: KeycloakAuthService) {}

  private apiUrl = 'http://195.35.48.198:8082/api/demandes';
  // private token = this.keycloak.getToken();
  private token = localStorage.getItem('currentToken');

  // Méthode pour obtenir les headers avec le token Bearer
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  // Méthode pour obtenir les headers spécifiques pour FormData
  private getFormDataHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  // Méthode pour soumettre la demande d'attestation
  submitAttestationRequest(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData, {
      headers: this.getFormDataHeaders()
    });
  }

  getDemandes(): Observable<DemandeDrtssResponse> {
    console.log('token actif', this.token);
    return this.http.get<DemandeDrtssResponse>(this.apiUrl, {
      headers: this.getFormDataHeaders()
    });
  }

  // Méthode pour obtenir le statut d'une demande
  getRequestStatus(requestId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${requestId}`, {
      headers: this.getHeaders()
    });
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}`, {
      headers: this.getHeaders()
    });
  }

  approveRequest(requestId: number, requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/approve`, requestData, {
      headers: this.getHeaders()
    });
  }

  reviewRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/review?status=PROCESSING`, {}, {
      headers: this.getHeaders()
    });
  }
}