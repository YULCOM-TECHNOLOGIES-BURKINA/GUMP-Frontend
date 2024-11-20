import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private currentUser: any = null;

  constructor() {
    // Automatically log in the user if details are found in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }


  getUserRole(): string | null {
    //const currentUser = localStorage.getItem('currentUser');
    // return this.currentUser ? this.currentUser.role : null;

    // Return the role of the currently logged-in user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser).role : null;
  }

  isAuthenticated(): boolean {
    // Check if a user is currently authenticated
    return this.currentUser !== null || localStorage.getItem('currentUser') !== null;
    //return this.currentUser !== null;
  }

  isAuthenticatedOrg(): boolean {
    if(localStorage.getItem('currentUser')){
      const savedUser = localStorage.getItem('currentUser');
      if (JSON.parse(savedUser).role == 'entreprise'){
        return this.currentUser !== null || localStorage.getItem('currentUser') !== null;
      } else {
        return false;
      }
    } else{
      return false;
    }
  }

  logout(): void {
    // Clear the user session and remove it from localStorage
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
