import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrtssService {

  private apiUrl = 'http://localhost:8080/api/attestations'; 

  constructor(private http: HttpClient) {}

  // Méthode pour soumettre la demande d'attestation
  submitAttestationRequest(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, formData);
  }

  // Méthode pour obtenir le statut d'une demande
  getRequestStatus(requestId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${requestId}`);
  }

  // Méthode pour traiter ou valider une demande
  processRequest(requestId: string, action: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/process/${requestId}`, { action });
  }

}
