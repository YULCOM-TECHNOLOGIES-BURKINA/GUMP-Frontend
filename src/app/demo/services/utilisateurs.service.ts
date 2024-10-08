import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateurs';

@Injectable({
    providedIn: 'root'
})
export class UtilisateurService {

    private apiUrl = 'https://api.monsite.com/utilisateurs'; // 

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
}
