import { Injectable } from '@angular/core';
import { HttpFastserviceService } from './http-fastservice.service';
import { Utilisateur } from '../models/utilisateurs';
import { API_ROOT } from 'src/environments/environment';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignatureElectroniquesService {

  constructor(private fastService:HttpFastserviceService) {  }



  public listUtilisateurDrtss(page: number, size: number) {
    return this.fastService.get<Utilisateur[]>(`${API_ROOT.API_LISTE_USERS_DRTSS}?page=${page}&size=${size}`).pipe(
       tap((utilisateurs) => {
          console.log("Liste des utilisateurs récupérée :", utilisateurs);
       }),
       catchError((error) => {
          console.error("Erreur lors de la récupération des utilisateurs :", error);
          return of([]);
       })
    );
 }

 public listUtilisateurSignataieDrtss(page: number, size: number) {
    return this.fastService.get<Utilisateur[]>(`${API_ROOT.API_LISTE_USERS_SIGNATAIRE_DRTSS}?page=${page}&size=${size}`).pipe(
       tap((utilisateurs) => {

    }),
       catchError((error) => {

        return of([]);
       })
    );
 }

 public listDemandes(page: number, size: number) {
    return this.fastService.get<Utilisateur[]>(`${API_ROOT.API_LISTE_DEMANDES}?page=${page}&size=${size}`).pipe(
       tap((utilisateurs) => {

    }),
       catchError((error) => {
           return of([]);

        })
    );
 }



  public creerUtilisateurDrtss(formData: FormData) {
    return this.fastService.post<Utilisateur>(API_ROOT.API_CREATE_USERS_DRTSS, formData).pipe(
      tap((res: Utilisateur) => {
        console.log("Utilisateur enregistré :", res);
      }),
      catchError(error => {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
         return of(null);
      })
    );
  }


  public createSignataire(selectedFile: File, selectedUser: { id: number }) {
    const formData: FormData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', selectedUser.id.toString());

    return this.fastService.post<any>(`${API_ROOT.API_CREATE_SIGNATAIRE_DRTSS}`, formData).pipe(
      tap((res) => {
        console.log('Signataire enregistré avec succès :', res);
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'enregistrement du signataire :', error);
        return of(null);
      })
    );
  }



  public signDocument(selectedFile: File, signatoryId: { id: number },attestationPath:string,alias:string,keyStorePassword:string) {
    const formData: FormData = new FormData();
    formData.append('keyStore', selectedFile);
    formData.append('signatoryId', signatoryId.toString());
    formData.append('attestationPath', attestationPath);
    formData.append('alias', alias);
    formData.append('keyStorePassword', keyStorePassword);

    console.log('form data',formData);

    return this.fastService.post<any>(`${API_ROOT.API_SIGNE_ATTESTATION_DRTSS}`, formData).pipe(
      tap((res) => {
        console.log('Attestation signée  avec succès :', res);
      }),
      catchError((error) => {
        console.error('Erreur lors de la sinature :', error);
        return of(null);
      })
    );
  }


}
