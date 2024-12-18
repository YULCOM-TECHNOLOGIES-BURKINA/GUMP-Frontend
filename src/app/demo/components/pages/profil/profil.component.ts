import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Utilisateur } from '../../../models/utilisateurs';
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


  getUserProfile() {
    if (this.currentUser !== null) {
        const user = JSON.parse(this.currentUser);
        this.userService.getUserByIfu(user.nom).subscribe({
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

  desactivateAccount() {
      this.desactivateAccountDialog = true;
  }

  confirmDesactivateAccount() {
      this.desactivateAccountDialog = false;
      this.messageService.add({
          severity: 'success',
          summary: 'Compte désactivé',
          detail: 'Votre a été désactivé avec succès',
          life: 3000,
      });
  }

  deleteAccount() {
      this.deleteAccountDialog = true;
  }

  confirmDeleteAccount() {
      this.deleteAccountDialog = false;
      this.messageService.add({
          severity: 'success',
          summary: 'Compte supprimé',
          detail: 'Votre a été supprimé avec succès',
          life: 3000,
      });
  }
}
