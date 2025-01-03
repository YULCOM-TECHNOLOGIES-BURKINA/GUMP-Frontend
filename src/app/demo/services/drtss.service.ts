import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeDrtss, DemandeDrtssResponse } from '../models/drtss';
import { KeycloakAuthService } from './keycloak-auth.service'

@Injectable({
    providedIn: 'root',
})
export class DrtssService {
    constructor(
        private http: HttpClient,
        private keycloak: KeycloakAuthService
    ) {}

    private apiUrl = 'https://gump-gateway.yulpay.com/api/demandes?service=drtss-ms';
    private apiGateway = 'https://gump-gateway.yulpay.com/api';
    private token = localStorage.getItem('currentToken');

    // Méthode pour obtenir les headers avec le token Bearer
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        });
    }

    // Méthode pour obtenir les headers spécifiques pour FormData
    private getFormDataHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
        });
    }

    // Méthode pour soumettre la demande d'attestation
    submitAttestationRequest(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}`, formData, {
            headers: this.getFormDataHeaders(),
        });
    }

    getDemandes(): Observable<DemandeDrtssResponse> {
        return this.http.get<DemandeDrtssResponse>(this.apiUrl, {
            headers: this.getFormDataHeaders(),
        });
    }

    // Méthode pour obtenir le statut d'une demande
    getRequestStatus(requestId: string): Observable<any> {
        return this.http.get(
            `${this.apiGateway}/demandes/status/${requestId}?service=drtss-ms`,
            {
                headers: this.getHeaders(),
            }
        );
    }

    getOneDemande(requestId: number): Observable<any> {
        return this.http.get(
            `${this.apiGateway}/demandes/${requestId}?service=drtss-ms`,
            {
                headers: this.getHeaders(),
            }
        );
    }

    approveRequest(requestId: number, requestData: any): Observable<any> {
        return this.http.post(
            `${this.apiGateway}/demandes/${requestId}/approve?service=drtss-ms`,
            requestData,
            {
                headers: this.getFormDataHeaders(),
            }
        );
    }

    rejectRequest(requestId: number, requestData: any): Observable<any> {
        return this.http.post(
            `${this.apiGateway}/demandes/${requestId}/review?status=REJECTED&rejectionReason=${requestData}&service=drtss-ms`,
            {
                headers: this.getFormDataHeaders(),
            }
        );
    }

    reviewRequest(requestId: number): Observable<any> {
        return this.http.post(
            `${this.apiGateway}/demandes/${requestId}/review?status=PROCESSING&service=drtss-ms`,
            {},
            {
                headers: this.getFormDataHeaders(),
            }
        );
    }

    rollbackRequest(requestId: number): Observable<any> {
        return this.http.post(
            `${this.apiGateway}/demandes/${requestId}/rollback-rejection?service=drtss-ms`,
            {},
            {
                headers: this.getFormDataHeaders(),
            }
        );
    }

    signedRequest(requestId: number): Observable<any> {
        return this.http.post(
            `${this.apiGateway}/demandes/${requestId}/review?status=SIGNED&service=drtss-ms`,
            {},
            {
                headers: this.getFormDataHeaders(),
            }
        );
    }
    // méthode pour effectuer le paiement
    makePayment(demandeId: number, callbackUrl: string): Observable<any> {
        const paymentData = {
            requestType: 'DRTPS',
            callbackUrl: callbackUrl,
        };

        return this.http.post(
            `${this.apiGateway}/demandes/${demandeId}/pay?service=drtss-ms`,
            paymentData,
            {
                headers: this.getHeaders(),
            }
        );
    }

    updatePaymentStatus(demandeId: number, paymentId: string): Observable<any> {
        return this.http.post(
            `${this.apiGateway}/demandes/${demandeId}/update-payment-status?paymentId=${paymentId}&service=drtss-ms`,
            {
                headers: this.getFormDataHeaders(),
            }
        );
    }
}
