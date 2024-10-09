import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeDrtss } from '../models/drtss';

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

  getDemandes(): Observable<DemandeDrtss[]> {
    return this.http.get<DemandeDrtss[]>(this.apiUrl);
  }

  // Méthode pour obtenir le statut d'une demande
  getRequestStatus(requestId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${requestId}`);
  }

  getOneDemande(requestId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}`);
  }

  // Méthode pour traiter ou valider une demande
  processRequest(requestId: string, action: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/process/${requestId}`, { action });
  }

}
