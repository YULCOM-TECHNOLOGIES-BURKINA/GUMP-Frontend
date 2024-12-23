import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { KeycloakAuthService } from '../../../services/keycloak-auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  valCheck: string[] = ['remember'];

  constructor(
    private authService: KeycloakAuthService,
    public layoutService: LayoutService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // Vérifier si l'utilisateur est déjà connecté
    this.authService.isAuthenticated().subscribe(authenticated => {
      if (authenticated) {
        this.redirectBasedOnRole();
      }
    });
  }

  login() {
    this.authService.login()
      .catch(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erreur', 
          detail: 'Connexion échouée. Veuillez vérifier vos informations!' 
        });
      });
  }

  private redirectBasedOnRole() {
    this.authService.getUserDetails().subscribe(user => {
      if (user) {
        const role = user.role[0]; // On prend le premier rôle
        switch (role) {
          case 'ADMIN':
            this.router.navigate(['/app']);
            break;
          case 'DRTSS_AGENT':
            this.router.navigate(['/app']);
            break;
          case 'DRTSS_REGIONAL_MANAGER':
            this.router.navigate(['/app']);
            break;
          case 'TRESOR_AGENT':
            this.router.navigate(['/app']);
            break;
          case 'USER':
            this.router.navigate(['']);
            break;
          default:
            this.router.navigate(['']);
        }
      }
    });
  }
}