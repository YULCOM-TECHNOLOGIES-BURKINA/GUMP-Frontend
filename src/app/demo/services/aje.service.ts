import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeAje, DemandeAjeResponse } from '../models/aje';

@Injectable({
  providedIn: 'root'
})
export class AjeService {

 private apiUrl = 'https://gump-gateway.yulpay.com/api/demandes';

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

  submitAttestationRequest(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}?service=tresor-ms`, requestData, {
      headers: this.getHeaders()
    });
  }

  getDemandes(): Observable<DemandeAjeResponse> {
    return this.http.get<DemandeAjeResponse>(`${this.apiUrl}?service=tresor-ms`, {
      headers: this.getFormDataHeaders()
  });
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}?service=tresor-ms`, {
      headers: this.getFormDataHeaders()
  });
  }

  approveRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/approve?service=tresor-ms`, {
      headers: this.getFormDataHeaders()
    });
  }

  rejectRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/review?status=REJECTED&service=tresor-ms`, {
      headers: this.getFormDataHeaders()
    });
  }

  reviewRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/review?status=PROCESSING&service=tresor-ms`, {}, {
      headers: this.getFormDataHeaders()
    });
  }

  rollbackRequest(requestId: number): Observable<any> {
    return this.http.post(
        `${this.apiUrl}/${requestId}/rollback-rejection?service=tresor-ms`,
        {},
        {
            headers: this.getFormDataHeaders(),
        }
    );
}

  makePayment(demandeId: number, callbackUrl: string): Observable<any> {
    const paymentData = {
      // requestType: "AJE",
      callbackUrl: callbackUrl
    };

    return this.http.post(`${this.apiUrl}/${demandeId}/pay?service=tresor-ms`, paymentData, {
      headers: this.getHeaders()
    });
  }

  updatePaymentStatus( demandeId: number, paymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${demandeId}/update-payment-status?paymentId=${paymentId}&service=tresor-ms`, {
      headers: this.getFormDataHeaders()
    });
  }
}
