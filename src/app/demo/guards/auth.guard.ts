import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { KeycloakAuthService } from '../services/keycloak-auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private currentUser: any = null;
  constructor(
    private authService: KeycloakAuthService,
    private router: Router
  ) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
  //   return this.currentUser !== null || localStorage.getItem('currentUser') !== null;
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(authenticated => {
        if (!authenticated) {
          this.router.navigate(['']);
          return false;
        }
        return true;
      })
    );
  }
}