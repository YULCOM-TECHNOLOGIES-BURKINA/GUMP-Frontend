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
        // onLoad: 'login-required',
        // responseMode: 'fragment'
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

//   public async logout(): Promise<void> {
//     localStorage.removeItem('currentUser');
//     await this.keycloak.logout({ redirectUri: window.location.origin });
//   }

    public async logout(): Promise<void> {
        try {
            // Redirect to landing or a login page after Keycloak logs out
            const redirectUri = `${window.location.origin}/`; // Modify if you want to redirect elsewhere

            // Perform the logout with Keycloak
            await this.keycloak.logout({ redirectUri });

            // Clear any stored session data and broadcast logout status
            this.isAuthenticatedSubject.next(false);
            this.userDetailsSubject.next(null);
            localStorage.removeItem('currentUser'); // Clear current user data
            localStorage.removeItem('currentToken');
        } catch (error) {
            console.error('Error during logout:', error);
        }
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
      localStorage.setItem('currentToken', this.keycloak.token);
    }
  }

  public getToken(): string | undefined {
    return this.keycloak.token;
  }
}