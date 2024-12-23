import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    styleUrl: './profil.component.scss',
    providers: [MessageService],
})
export class ProfilComponent implements OnInit {
  profil = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      passwordConfirm: '',
      doubleAuth: false,
  };

  deleteAccountDialog = false;
  desactivateAccountDialog = false;

  currentUser = localStorage.getItem('currentUser');
  request: any;

  constructor(
      private userService: UserService,
      private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getUserProfile();
  }

saveProfil() {
    if (this.request) {
        const userData = {
            lastname: this.request.lastname,
            forename: this.request.forename            
        };

        this.userService.saveMe(userData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Profil mis à jour',
                    detail: 'Les nouvelles informations du profil ont été sauvegardées!'
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Une erreur est survenue lors de la modification du profil."
                });
            }
        });
    } else {
        this.messageService.add({
            severity: 'warn',
            summary: 'Attention',
            detail: 'Veuillez remplir le nom et le prénom.'
        });
    }
}

  getUserProfile() {
    if (this.currentUser !== null) {
        this.userService.getMe().subscribe({
            next: (response) => {
                this.request = response; 
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erruer',
                    detail: 'Informations du profile non disponibles'
                }); 
            }
        }); 
       
    }
  }
}
