import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor( private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userDetails = localStorage.getItem('currentUser');
    
    if (userDetails) {
      const user = JSON.parse(userDetails);
      const roles = user.role;
    
      if (roles.includes('USER')){
        this.router.navigate(['']);
        return false;
      } else{
        return true;
      }
    } else {
        return false;
    }
  }
}
