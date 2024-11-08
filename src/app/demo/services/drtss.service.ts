import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeDrtss, DemandeDrtssResponse } from '../models/drtss';

@Injectable({
  providedIn: 'root'
})
export class DrtssService {

  private apiUrl = 'http://54.37.13.176:8082/api/demandes';

  constructor(private http: HttpClient) {}

  // Méthode pour soumettre la demande d'attestation
  submitAttestationRequest(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  getDemandes(): Observable<DemandeDrtssResponse> {
    return this.http.get<DemandeDrtssResponse>(this.apiUrl);  // Récupère les données de type DemandeDrtssResponse
  }

  // Méthode pour obtenir le statut d'une demande
  getRequestStatus(requestId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${requestId}`);
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}`);
  }


  approveRequest(requestId: number, requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/approve`, requestData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  reviewRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/review?status=PROCESSING`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


}
