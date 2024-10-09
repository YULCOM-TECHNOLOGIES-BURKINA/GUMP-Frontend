import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../../../services/auth.service';

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
export class LoginComponent {

    valCheck: string[] = ['remember'];

    username: string = '';
    password: string = '';

    constructor(
        private authService: AuthService,
        public layoutService: LayoutService,
        private router: Router, 
        private messageService: MessageService 
    ) { }


  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/app']);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Connexion échouée. Veuillez vérifier vos informations!' });
    }
  }
}
