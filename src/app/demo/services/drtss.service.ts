import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { DemandeDrtss, DemandeDrtssResponse } from '../models/drtss';
import { KeycloakAuthService } from './keycloak-auth.service'

@Injectable({
  providedIn: 'root'
})
export class DrtssService {

  constructor(private http: HttpClient, private keycloak: KeycloakAuthService) {}

//  private apiUrl = 'https://gump-gateway.yulpay.com/api/demandes?service=drtss-ms';
//  private apiGateway = 'https://gump-gateway.yulpay.com/api';

private apiUrl = 'http://localhost:9090/api/demandes?service=drtss-ms';
private apiGateway = 'http://localhost:9090/api';

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
    const userDetails = localStorage.getItem('currentUser');
    if (!userDetails) {
        throw new Error('User not authenticated. Please log in.');
    }

    const user = JSON.parse(userDetails);
    if (!user.email) {
        throw new Error('User email is missing.');
    }

    formData.append('email', user.email);

    return this.http.post(`${this.apiUrl}`, formData).pipe(
        catchError(error => {
            console.error('Error submitting attestation request', error);
            return throwError(() => new Error('Failed to submit attestation request'));
        })
    );
}

  getDemandes(): Observable<DemandeDrtssResponse> {
    const userDetails = localStorage.getItem('currentUser');
    if (!userDetails) {
        throw new Error('User not authenticated. Please log in.');
    }

    const user = JSON.parse(userDetails);
    if (!user.email) {
        throw new Error('User email is missing.');
    }


    return this.http.get<DemandeDrtssResponse>(`${this.apiGateway}/demandes?email=${user.email}&service=drtss-ms`, {
      headers: this.getFormDataHeaders()
    });
  }

  // Méthode pour obtenir le statut d'une demande
  getRequestStatus(requestId: string): Observable<any> {
    return this.http.get(`${this.apiGateway}/demandes/status/${requestId}?service=drtss-ms`, {
      headers: this.getHeaders()
    });
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiGateway}/demandes/${requestId}?service=drtss-ms`, {
      headers: this.getHeaders()
    });
  }

  approveRequest(requestId: number, requestData: any): Observable<any> {
    const userDetails = localStorage.getItem('currentUser');
    if (!userDetails) {
        throw new Error('User not authenticated. Please log in.');
    }

    const user = JSON.parse(userDetails);
    if (!user.email) {
        throw new Error('User email is missing.');
    }

    return this.http.post(`${this.apiGateway}/demandes/${requestId}/approve?email=${user.email}&service=drtss-ms`, requestData, {
      headers: this.getHeaders()
    });
  }

  rejectRequest(requestId: number, requestData: any): Observable<any> {
    const userDetails = localStorage.getItem('currentUser');
    if (!userDetails) {
        throw new Error('User not authenticated. Please log in.');
    }

    const user = JSON.parse(userDetails);
    if (!user.email) {
        throw new Error('User email is missing.');
    }

    return this.http.post(`${this.apiGateway}/demandes/${requestId}/review?status=REJECTED?rejectionReason=${requestData}?email=${user.email}&service=drtss-ms`, {
      headers: this.getFormDataHeaders()
    });
  }

  reviewRequest(requestId: number): Observable<any> {
    const userDetails = localStorage.getItem('currentUser');
    if (!userDetails) {
        throw new Error('User not authenticated. Please log in.');
    }

    const user = JSON.parse(userDetails);
    if (!user.email) {
        throw new Error('User email is missing.');
    }
    return this.http.post(`${this.apiGateway}/demandes/${requestId}/review?status=PROCESSING?service=drtss-ms?email=${user.email}&service=drtss-ms`, {}, {
      headers: this.getFormDataHeaders()
    });
  }

   // méthode pour effectuer le paiement
   makePayment(demandeId: number, callbackUrl: string): Observable<any> {
    const paymentData = {
      requestType: "DRTPS",
      callbackUrl: callbackUrl
    };

    return this.http.post(`${this.apiUrl}/${demandeId}/pay`, paymentData, {
      headers: this.getHeaders()
    });
  }

  updatePaymentStatus( demandeId: number, paymentId: string): Observable<any> {

    const paymentData = {
      paymentId: paymentId
    };

    return this.http.post(`http://195.35.48.198:8082/api/demandes/${demandeId}/update-payment-status?paymentId=${paymentId}`, {
      headers: this.getHeaders()
    });
  }
}
