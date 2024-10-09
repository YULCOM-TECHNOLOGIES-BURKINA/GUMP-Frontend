import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'drtss', password: 'drtss123', role: 'admin_drtss' },
    { username: 'entreprise', password: 'entreprise123', role: 'entreprise' }
  ];

  private currentUser: any = null;

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  getUserRole(): string | null {
    return this.currentUser ? this.currentUser.role : null;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}
