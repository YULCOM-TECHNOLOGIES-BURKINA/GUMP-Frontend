import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Demande } from '../models/demande';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private apiUrl = 'assets/simulation.json'; 
  private apiUrl1 = 'assets/demande_one.json'; 

  constructor(private http: HttpClient) { }

  // Fonction qui récupère les demandes via API pour chaque acte
  getDemandesP(): Promise<Demande[]> {
    return this.http.get<Demande[]>('API_URL').toPromise();
  }

  getDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(this.apiUrl);
  }


  getOneDemande(): Observable<Demande> {
    return this.http.get<Demande>(this.apiUrl1);  
  }

  updateDemande(demande: Demande): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demande.id}`, demande);
  }

}
