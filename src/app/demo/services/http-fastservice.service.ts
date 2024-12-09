import {
    HttpHeaders,
    HttpClient,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpFastserviceService {
    /*   httpOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: new HttpHeaders({
             'Content-Type': 'multipart/form-data',
            enctype: 'multipart/form-data',
            Accept: 'multipart/form-data',
            Authorization: 'Bearer ' + '',
        }),
    };*/
    private token = localStorage.getItem('currentToken');

    // Méthode pour obtenir les headers avec le token Bearer
  /*  private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });
    }*/

  // Méthode pour obtenir les headers spécifiques pour FormData
  private getFormDataHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }



    status!: string;
    errorMessage: any;

    constructor(
        private http: HttpClient,

        protected router: Router
    ) {}

    /**
     * Service CRUD avec gestion des erreurs.
     */

    // POST Method
    public post<T>(url: string, body: Object): Observable<T> {
       return this.http
         .post<T>(url, body)
         .pipe(
           catchError((error) => this.handleError(error))
         );
     }


    // PUT Method
    public put<T>(url: string, body: Object): Observable<T> {
        return this.http
            .put<T>(url, body, { observe: 'body' })
            .pipe(catchError(this.handleError));
    }

    // PATCH Method
    public patch<T>(url: string, body: Object): Observable<T> {
        return this.http
            .patch<T>(url, body, { observe: 'body' })
            .pipe(catchError(this.handleError));
    }

    // DELETE Method
    public delete<T>(url: string): Observable<T> {
        return this.http
            .delete<T>(url, { observe: 'body' })
            .pipe(catchError(this.handleError));
    }

    // GET Method
    public get<T>(url: string): Observable<T> {
        return this.http
            .get<T>(url, { observe: 'body' })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('Erreur lors de la requête HTTP :', error.message);
        return throwError(() => new Error('Erreur de requête HTTP'));
    }



    /**
     * Recuperation d'une valeur par la clé de stockage
     * @param key
     * @constructor
     */
    public FunctionStorageGetItem(key: string) {
        return localStorage.getItem(key);
    }

    /**
     * Enregistrer des données dans en local
     * @param key
     * @param value
     * @constructor
     */
    public FunctionStorageSetItem(key: string, value: object) {
        console.log('prochart setItem');
        localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Suppression de valeur stocké en local
     * @param key
     * @constructor
     */
    public FunctionStorageRemoveItem(key: string) {
        return localStorage.removeItem(key);
    }

    downloadFile(path: string): Observable<Blob> {
        const url = 'http://localhost:8082/api/download_certificate'; // URL de votre backend
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(url, { path }, { headers, responseType: 'blob' });
      }


}
