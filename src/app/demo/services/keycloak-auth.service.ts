import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {
  private keycloak: Keycloak;
  private jwtHelper: JwtHelperService;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userDetailsSubject = new BehaviorSubject<any>(null);
  private tokenCheckInterval: any;

  constructor(private router: Router) {
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
          this.setupTokenRefresh();
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

  private setupTokenRefresh(): void {
    // Vérifier le token toutes les 60 secondes
    this.tokenCheckInterval = setInterval(() => {
      this.checkTokenValidity();
    }, 60000);

    // Configuration du refresh automatique
    this.keycloak.onTokenExpired = () => {
      this.refreshToken();
    };
  }

  private async checkTokenValidity(): Promise<void> {
    const token = this.keycloak.token;
    if (token) {
      const isExpired = this.jwtHelper.isTokenExpired(token);
      if (isExpired) {
        try {
          await this.refreshToken();
        } catch (error) {
          console.error('Impossible de rafraîchir le token:', error);
          await this.handleTokenError();
        }
      }
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const refreshed = await this.keycloak.updateToken(50); // Rafraîchit si le token expire dans moins de 50 secondes
      if (refreshed) {
        this.updateUserDetails();
      }
    } catch (error) {
      throw error;
    }
  }

  private async handleTokenError(): Promise<void> {
    // Nettoyer l'intervalle de vérification
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
    
    // Déconnexion et redirection
    await this.logout();
  }

  public async logout(): Promise<void> {
      try {
          const redirectUri = `${window.location.origin}/`; 

          // Nettoyer l'intervalle avant la déconnexion
          if (this.tokenCheckInterval) {
            clearInterval(this.tokenCheckInterval);
          }

          // Nettoyer les données locales
          this.isAuthenticatedSubject.next(false);
          this.userDetailsSubject.next(null);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('currentToken');

          // Déconnexion Keycloak
          await this.keycloak.logout({ redirectUri });
      } catch (error) {
          console.error('Erreur pendant la déconnexion:', error);
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
        nes: decodedToken.nes,
        role_realm_access: decodedToken.realm_access?.roles || [],
        role: decodedToken.resource_access?.gump?.roles || [],
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

  // Méthode pour nettoyer les ressources lors de la destruction du service
  public destroy(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }
}