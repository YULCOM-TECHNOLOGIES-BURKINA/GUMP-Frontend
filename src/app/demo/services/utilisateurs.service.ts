import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateurs';

import { environment } from 'src/environments/environment'; 


@Injectable({
    providedIn: 'root'
})
export class UtilisateurService {

    private apiUrl = 'http://195.35.48.198:8081/api';

    constructor(private http: HttpClient) { }

    getUtilisateurs(): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(this.apiUrl);
    }

    desactiverUtilisateur(id: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/desactiver`, {});
    }

    supprimerUtilisateur(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Méthode pour soumettre la demande d'attestation
  submitUtilisateurRequest(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, formData);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

}
