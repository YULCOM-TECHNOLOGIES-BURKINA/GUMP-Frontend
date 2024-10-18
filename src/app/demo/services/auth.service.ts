import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'drtss', password: 'drtss123', role: 'admin_drtss' },
    { username: 'drtss_agent', password: 'drtss_agent123', role: 'agent_drtss' },
    { username: 'entreprise', password: 'entreprise123', role: 'entreprise' }
  ];

  private currentUser: any = null;

  constructor() {
    // Automatically log in the user if details are found in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      // this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
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

  logout(): void {
    // Clear the user session and remove it from localStorage
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
