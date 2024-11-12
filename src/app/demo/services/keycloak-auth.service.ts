import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {
  private keycloak: Keycloak;
  private jwtHelper: JwtHelperService;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userDetailsSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.jwtHelper = new JwtHelperService();
    this.keycloak = new Keycloak({
      url: 'https://sso.kulturman.com',
      realm: 'gump',
      clientId: 'gump'
    });
  }

  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.keycloak.init({
        // onLoad: 'check-sso',
        // silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
        onLoad: 'login-required',
        responseMode: 'fragment'
      }).then((authenticated) => {
        if (authenticated) {
          this.updateUserDetails();
        }
        this.isAuthenticatedSubject.next(authenticated);
        resolve(authenticated);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public login(): Promise<void> {
    return this.keycloak.login();
  }

  public logout(): Promise<void> {
    return this.keycloak.logout();
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public getUserDetails(): Observable<any> {
    return this.userDetailsSubject.asObservable();
  }

  private updateUserDetails(): void {
    if (this.keycloak.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.keycloak.token);
      const userDetails = {
        nom: decodedToken.family_name,
        prenom: decodedToken.given_name,
        email: decodedToken.email,
        role: decodedToken.realm_access?.roles || [],
        username: decodedToken.preferred_username
      };
      this.userDetailsSubject.next(userDetails);
      localStorage.setItem('currentUser', JSON.stringify(userDetails));
    }
  }

  public getToken(): string | undefined {
    return this.keycloak.token;
  }
}