import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Demande } from '../models/demande';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  constructor(private http: HttpClient) { }

  // Fonction qui récupère les demandes via API pour chaque acte
  getDemandes(): Promise<Demande[]> {
    return this.http.get<Demande[]>('API_URL').toPromise();
  }
}
